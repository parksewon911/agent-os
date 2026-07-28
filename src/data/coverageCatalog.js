/**
 * 보장분석 카탈로그
 * 참고 구조: coverageMaster (담보 카테고리 · 권장금액 · 레이더 목표)
 * 금액 단위: 만원
 */

export const CATEGORY_DISPLAY_NAMES = {
  암: '암 관련 진단비',
  뇌: '뇌 관련 진단비',
  심장: '심장 관련 진단비',
  치료비: '암·순환계 치료비/생활비',
  수술비: '수술비 관련 보장',
  '입원/일당': '입원/일당 관련 보장',
  '치매/간병': '치매/간병 관련 보장',
  '골절/부상': '골절/부상 관련 보장',
  '운전자/배상': '운전자/배상 관련 보장',
  사망: '사망 관련 보장',
  후유장해: '후유장해 관련 보장',
  의료실비: '의료실비 관련 보장',
  치아: '치아 관련 보장',
  기타: '기타 관련 보장',
}

/** 레이더/권장 목표 (만원) — 참고 사이트 RADAR_GOALS 구조 */
export const RADAR_GOALS = {
  암: 6000,
  뇌: 6000,
  심장: 6000,
  사망: 10000,
  수술비: 2000,
  의료실비: 1,
  치료비: 5000,
  '치매/간병': 3500,
}

export const CATEGORY_DISPLAY_ORDER = [
  '암',
  '뇌',
  '심장',
  '치료비',
  '수술비',
  '입원/일당',
  '치매/간병',
  '골절/부상',
  '운전자/배상',
  '사망',
  '후유장해',
  '의료실비',
  '치아',
  '기타',
]

/** 보험사명 정규화 별칭 (parserEngine normalizeCompanyName 패턴) */
export const INSURER_ALIASES = {
  삼성화재해상보험: '삼성화재',
  삼성생명보험: '삼성생명',
  현대해상화재보험: '현대해상',
  KB손해보험: 'KB손보',
  DB손해보험: 'DB손보',
  메리츠화재해상보험: '메리츠화재',
  한화생명보험: '한화생명',
  교보생명보험: '교보생명',
  롯데손해보험: '롯데손보',
  흥국화재해상보험: '흥국화재',
  농협생명보험: 'NH생명',
  농협손해보험: 'NH손보',
}

export function normalizeInsurer(name = '') {
  const t = String(name).replace(/\s+/g, '')
  return INSURER_ALIASES[t] || name || '미상'
}

export function keywordToCategory(text = '') {
  const s = String(text)
  if (/암|유사암|고액암/.test(s)) return '암'
  if (/뇌졸중|뇌출혈|뇌경색|뇌혈관/.test(s)) return '뇌'
  if (/심근|허혈|심장|협심/.test(s)) return '심장'
  if (/수술/.test(s)) return '수술비'
  if (/입원|일당/.test(s)) return '입원/일당'
  if (/치매|간병|장기요양/.test(s)) return '치매/간병'
  if (/골절|부상|화상/.test(s)) return '골절/부상'
  if (/운전자|배상/.test(s)) return '운전자/배상'
  if (/사망|종신/.test(s)) return '사망'
  if (/후유|장해/.test(s)) return '후유장해'
  if (/실손|실비|의료비/.test(s)) return '의료실비'
  if (/치아|임플/.test(s)) return '치아'
  if (/치료|항암|방사선/.test(s)) return '치료비'
  return '기타'
}
