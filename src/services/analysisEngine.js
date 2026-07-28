/**
 * 보장분석 엔진
 * 참고 파이프라인 (pro-insuranceanalysis):
 *   PDF(pdf.js) → parserEngine(보험사별 파싱) → coverageMaster(권장·카테고리)
 *   → Gemini/Vertex(/api/gemini-proxy) 제안서 분석 → Before/After → 리포트
 *   → Supabase(analysis_customers / analysis_snapshots) 저장
 *
 * 설계사 AI: 동일 흐름을 클라이언트 목/로컬 스냅샷으로 구현.
 * 리포트 소속에 인카·프로직단·총괄 등 외부 조직명 사용 금지.
 */

import {
  CATEGORY_DISPLAY_NAMES,
  CATEGORY_DISPLAY_ORDER,
  RADAR_GOALS,
  keywordToCategory,
  normalizeInsurer,
} from '../data/coverageCatalog.js'

const SNAP_KEY = 'seolgyesa_analysis_snapshots'

/** 샘플: 증권/보장분석 PDF 파싱 결과 (parserEngine 출력 형태) */
export const SAMPLE_BEFORE_PARSE = {
  source: 'sample-policy.pdf',
  insurer: '삼성화재해상보험',
  products: [
    { name: '실손의료비보험', premium: 48000, covers: [{ name: '실손의료비', amountMan: 1 }] },
    { name: '종신보험', premium: 120000, covers: [{ name: '질병사망', amountMan: 10000 }] },
    {
      name: '암보험',
      premium: 35000,
      covers: [{ name: '일반암진단', amountMan: 3000 }],
    },
  ],
}

/** 샘플: 가입제안서 Gemini 분석 결과 형태 */
export const SAMPLE_AFTER_PARSE = {
  source: 'sample-proposal.pdf',
  insurer: '제안 통합',
  products: [
    {
      name: '통합건강보험',
      premium: 89000,
      covers: [
        { name: '일반암진단', amountMan: 5000 },
        { name: '질병수술', amountMan: 200 },
        { name: '간병일당', amountMan: 900 },
      ],
    },
    { name: '실손 유지', premium: 48000, covers: [{ name: '실손의료비', amountMan: 1 }] },
    {
      name: '종신+CI특약',
      premium: 128000,
      covers: [
        { name: '질병사망', amountMan: 10000 },
        { name: '뇌졸중진단', amountMan: 3000 },
        { name: '급성심근경색', amountMan: 3000 },
      ],
    },
  ],
}

function aggregateCovers(products) {
  const map = {}
  for (const p of products) {
    for (const c of p.covers || []) {
      const cat = keywordToCategory(c.name)
      map[cat] = (map[cat] || 0) + (Number(c.amountMan) || 0)
    }
  }
  return map
}

export function buildCoverageDiff(beforeProducts, afterProducts) {
  const before = aggregateCovers(beforeProducts)
  const after = aggregateCovers(afterProducts)
  const cats = new Set([...Object.keys(before), ...Object.keys(after), ...Object.keys(RADAR_GOALS)])

  return CATEGORY_DISPLAY_ORDER.filter((c) => cats.has(c) || RADAR_GOALS[c]).map((cat) => {
    const b = before[cat] || 0
    const a = after[cat] || 0
    const goal = RADAR_GOALS[cat]
    const binary = cat === '의료실비'
    return {
      cat,
      label: CATEGORY_DISPLAY_NAMES[cat] || cat,
      before: binary ? (b > 0 ? '보유' : '없음') : b ? `${b.toLocaleString()}만` : '없음',
      after: binary ? (a > 0 ? '보유' : '없음') : a ? `${a.toLocaleString()}만` : '없음',
      beforeNum: b,
      afterNum: a,
      goal,
      goalLabel: goal == null ? '-' : binary ? '보유 권장' : `${goal.toLocaleString()}만`,
      up: a > b,
      gapAfter: goal == null ? 0 : binary ? (a > 0 ? 0 : 1) : Math.max(0, goal - a),
      status: !goal ? 'ok' : binary ? (a > 0 ? 'ok' : 'warn') : a >= goal * 0.7 ? 'ok' : 'warn',
    }
  })
}

export function buildRiskIndicators(diff) {
  const weak = diff.filter((d) => d.status === 'warn')
  const renewRisk = weak.some((d) => d.cat === '의료실비')
  return [
    {
      label: '갱신형 비중',
      note: renewRisk ? '실손 등 갱신형 점검 필요' : '실손 중심 · 관리 가능',
      ok: !renewRisk,
    },
    {
      label: '보장 범위 적정성',
      note: weak.length ? `${weak.map((w) => w.cat).join(', ')} 보강 권장` : '권장 대비 양호',
      ok: weak.length === 0,
    },
    {
      label: '만기 설정 리스크',
      note: '종신·연령만기 혼합 구조 점검',
      ok: true,
    },
  ]
}

export function buildAiOpinion(form, diff) {
  const weak = diff.filter((d) => d.status === 'warn').map((d) => d.cat)
  const name = form.insured || form.contractor || '고객'
  if (!weak.length) {
    return `${name}님 기준 핵심 담보는 권장 수준에 근접합니다. 유지 관리와 갱신형(실손) 인상만 정기 점검하면 됩니다.`
  }
  return `${name}님 분석 결과, ${weak.join('·')} 영역이 권장 대비 부족합니다. 제안안(After)으로 해당 공백을 메우되, 월 보험료 증가분과 갱신형 비중을 함께 설명하는 것이 좋습니다.`
}

/**
 * 리포트 메타 — 소속은 비우거나 사용자 입력만 사용.
 * 인카금융서비스 / 프로직단 / 총괄 등 하드코딩 금지.
 */
export function buildReportMeta(form) {
  return {
    brand: '설계사 AI',
    contractor: form.contractor || '',
    insured: form.insured || '',
    age: form.age || '',
    gender: form.gender || '',
    agent: form.agent || '',
    date: form.date || new Date().toISOString().slice(0, 10),
    org: form.org || '', // 사용자가 직접 입력할 때만 표시
  }
}

export function runFullAnalysis(form, beforeParse = SAMPLE_BEFORE_PARSE, afterParse = SAMPLE_AFTER_PARSE) {
  const beforeProducts = beforeParse.products.map((p) => ({
    ...p,
    insurer: normalizeInsurer(beforeParse.insurer),
  }))
  const afterProducts = afterParse.products.map((p) => ({
    ...p,
    insurer: normalizeInsurer(afterParse.insurer),
  }))
  const diff = buildCoverageDiff(beforeProducts, afterProducts)
  const risks = buildRiskIndicators(diff)
  const opinion = buildAiOpinion(form, diff)
  const meta = buildReportMeta(form)
  const premiumBefore = beforeProducts.reduce((s, p) => s + p.premium, 0)
  const premiumAfter = afterProducts.reduce((s, p) => s + p.premium, 0)

  return {
    meta,
    before: { ...beforeParse, insurer: normalizeInsurer(beforeParse.insurer), products: beforeProducts },
    after: { ...afterParse, insurer: normalizeInsurer(afterParse.insurer), products: afterProducts },
    diff,
    risks,
    opinion,
    premiumBefore,
    premiumAfter,
    analyzedAt: new Date().toISOString(),
  }
}

export function saveSnapshot(result) {
  const list = loadSnapshots()
  const row = { id: `snap_${Date.now()}`, ...result }
  list.unshift(row)
  localStorage.setItem(SNAP_KEY, JSON.stringify(list.slice(0, 20)))
  return row
}

export function loadSnapshots() {
  try {
    return JSON.parse(localStorage.getItem(SNAP_KEY) || '[]')
  } catch {
    return []
  }
}
