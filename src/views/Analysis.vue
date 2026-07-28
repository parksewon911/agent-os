<template>
  <section>
    <div class="page-head">
      <div>
        <h1>AI 보장분석</h1>
        <p>PDF 파싱 → 담보 정규화 → 권장 대비 진단 → Before/After → 로컬 스냅샷 저장</p>
      </div>
      <div class="actions">
        <button class="btn btn-ghost" type="button" @click="saveWork" :disabled="!result">작업 저장</button>
        <button class="btn btn-teal" type="button" :disabled="!result || geminiBusy" @click="refineOpinion">
          {{ geminiBusy ? '의견 작성 중…' : 'AI 종합의견 다듬기' }}
        </button>
        <button class="btn btn-primary" type="button" @click="runAnalysis">분석 실행</button>
      </div>
    </div>

    <div class="steps-row">
      <div class="step-chip" :class="{ on: step >= 1 }"><span>1</span> 업로드·파싱</div>
      <div class="step-chip" :class="{ on: step >= 2 }"><span>2</span> 작업저장</div>
      <div class="step-chip" :class="{ on: step >= 3 }"><span>3</span> 대시보드</div>
    </div>

    <div class="grid grid-2" style="margin-bottom: 16px">
      <article class="card">
        <h3>고객 기본 정보</h3>
        <div class="grid grid-2">
          <div class="field">
            <label>계약자</label>
            <input v-model="form.contractor" />
          </div>
          <div class="field">
            <label>피보험자</label>
            <input v-model="form.insured" />
          </div>
          <div class="field">
            <label>고객 연령</label>
            <input v-model.number="form.age" type="number" />
          </div>
          <div class="field">
            <label>성별</label>
            <select v-model="form.gender">
              <option>남성</option>
              <option>여성</option>
            </select>
          </div>
          <div class="field">
            <label>분석 담당자</label>
            <input v-model="form.agent" placeholder="담당 설계사명" />
          </div>
          <div class="field">
            <label>분석 일자</label>
            <input v-model="form.date" type="date" />
          </div>
          <div class="field" style="grid-column: 1 / -1">
            <label>소속 (선택 · 직접 입력)</label>
            <input v-model="form.org" placeholder="비워두면 리포트에 소속란 미표시" />
          </div>
        </div>
      </article>

      <article class="card">
        <h3>주요 리스크 지표</h3>
        <div v-if="result" class="list-gap">
          <div v-for="r in result.risks" :key="r.label" class="gap-item">
            <div>
              <strong>{{ r.label }}</strong>
              <div class="muted">{{ r.note }}</div>
            </div>
            <span class="tag" :class="r.ok ? 'ok' : 'warn'">{{ r.ok ? '양호' : '주의' }}</span>
          </div>
        </div>
        <p v-else class="muted">분석 실행 후 갱신형 비중 · 보장 적정성 · 만기 리스크가 표시됩니다.</p>
      </article>
    </div>

    <div class="grid grid-2" style="margin-bottom: 16px">
      <article class="card">
        <h3>기존 보험 (Before)</h3>
        <p class="muted">보장분석·증권 PDF → 텍스트 추출 → 보험사별 파서 (데모: 샘플 파싱)</p>
        <div class="drop-zone" @click="loadBefore">
          <div style="font-size: 1.6rem; color: var(--accent)">▣</div>
          <div>기존 증권 PDF 업로드 (샘플 로드)</div>
        </div>
        <table v-if="beforeParse" class="table" style="margin-top: 12px">
          <thead>
            <tr>
              <th>보험사</th>
              <th>상품</th>
              <th>월 보험료</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in beforeParse.products" :key="p.name">
              <td>{{ beforeParse.insurer }}</td>
              <td>{{ p.name }}</td>
              <td>{{ p.premium.toLocaleString() }}원</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="card">
        <h3>제안 보험 (After)</h3>
        <p class="muted">가입제안서 PDF → AI 담보 추출 (데모: 샘플 제안)</p>
        <div class="drop-zone" @click="loadAfter">
          <div style="font-size: 1.6rem; color: var(--teal)">◇</div>
          <div>가입 제안서 PDF 업로드 (샘플 로드)</div>
        </div>
        <table v-if="afterParse" class="table" style="margin-top: 12px">
          <thead>
            <tr>
              <th>상품</th>
              <th>월 보험료</th>
              <th>핵심 담보</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in afterParse.products" :key="p.name">
              <td>{{ p.name }}</td>
              <td>{{ p.premium.toLocaleString() }}원</td>
              <td>{{ p.covers.map((c) => c.name).join(', ') }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>

    <article v-if="result" class="card" style="margin-bottom: 16px">
      <h3>담보별 상세 변화 · 권장 대비</h3>
      <table class="table" style="margin-top: 8px">
        <thead>
          <tr>
            <th>담보</th>
            <th>Before</th>
            <th>After</th>
            <th>권장</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in result.diff" :key="d.cat">
            <td>{{ d.label }}</td>
            <td>{{ d.before }}</td>
            <td>{{ d.after }}</td>
            <td>{{ d.goalLabel }}</td>
            <td>
              <span class="tag" :class="d.status === 'ok' ? 'ok' : 'warn'">
                {{ d.up ? '보강' : d.status === 'ok' ? '양호' : '부족' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <p style="margin: 16px 0 0; line-height: 1.6">{{ result.opinion }}</p>
      <p v-if="geminiError" style="color: var(--danger)">{{ geminiError }}</p>
      <div class="muted" style="margin-top: 10px">
        월 보험료 {{ result.premiumBefore.toLocaleString() }}원 →
        {{ result.premiumAfter.toLocaleString() }}원
        ({{ result.premiumAfter - result.premiumBefore >= 0 ? '+' : ''
        }}{{ (result.premiumAfter - result.premiumBefore).toLocaleString() }})
      </div>
    </article>

    <article v-if="result" class="card report-card">
      <h3>리포트 표지 정보</h3>
      <p class="muted">소속은 직접 입력한 경우에만 리포트에 표시됩니다.</p>
      <div class="report-meta">
        <div><span class="muted">브랜드</span><strong>{{ result.meta.brand }}</strong></div>
        <div><span class="muted">피보험자</span><strong>{{ result.meta.insured }}</strong></div>
        <div><span class="muted">분석일</span><strong>{{ result.meta.date }}</strong></div>
        <div><span class="muted">담당</span><strong>{{ result.meta.agent || '-' }}</strong></div>
        <div v-if="result.meta.org">
          <span class="muted">소속</span><strong>{{ result.meta.org }}</strong>
        </div>
      </div>
    </article>

    <article v-if="snapshots.length" class="card" style="margin-top: 16px">
      <h3>저장된 작업 (로컬)</h3>
      <p class="muted">참고 사이트의 analysis_snapshots와 같은 역할 · 이 브라우저에만 저장</p>
      <table class="table">
        <thead>
          <tr>
            <th>시각</th>
            <th>고객</th>
            <th>담당</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in snapshots" :key="s.id">
            <td>{{ s.analyzedAt?.slice(0, 19).replace('T', ' ') }}</td>
            <td>{{ s.meta?.insured }}</td>
            <td>{{ s.meta?.agent || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </article>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import {
  SAMPLE_AFTER_PARSE,
  SAMPLE_BEFORE_PARSE,
  loadSnapshots,
  runFullAnalysis,
  saveSnapshot,
} from '../services/analysisEngine.js'
import { askGemini } from '../services/gemini.js'

const step = ref(0)
const form = reactive({
  contractor: '김민수',
  insured: '김민수',
  age: 42,
  gender: '남성',
  agent: '',
  org: '',
  date: new Date().toISOString().slice(0, 10),
})

const beforeParse = ref(null)
const afterParse = ref(null)
const result = ref(null)
const snapshots = ref([])
const geminiBusy = ref(false)
const geminiError = ref('')

function loadBefore() {
  beforeParse.value = structuredClone(SAMPLE_BEFORE_PARSE)
  step.value = Math.max(step.value, 1)
}

function loadAfter() {
  afterParse.value = structuredClone(SAMPLE_AFTER_PARSE)
  step.value = Math.max(step.value, 1)
}

function runAnalysis() {
  if (!beforeParse.value) loadBefore()
  if (!afterParse.value) loadAfter()
  result.value = runFullAnalysis(form, beforeParse.value, afterParse.value)
  step.value = 3
  geminiError.value = ''
}

async function refineOpinion() {
  if (!result.value || geminiBusy.value) return
  geminiBusy.value = true
  geminiError.value = ''
  try {
    const diffLines = result.value.diff
      .map((d) => `- ${d.label}: ${d.before} → ${d.after} (권장 ${d.goalLabel}, ${d.status})`)
      .join('\n')
    result.value.opinion = await askGemini({
      prompt: `보험 보장분석 AI 종합 의견을 한국어로 작성하세요. 3~5문장.
고객: ${form.insured}, ${form.age}세 ${form.gender}
월 보험료: ${result.value.premiumBefore} → ${result.value.premiumAfter}원
담보 변화:
${diffLines}
조직명·총괄 직함은 넣지 마세요. 의견 본문만 출력.`,
    })
  } catch (e) {
    geminiError.value = e.message
  } finally {
    geminiBusy.value = false
  }
}

function saveWork() {
  if (!result.value) return
  saveSnapshot(result.value)
  snapshots.value = loadSnapshots()
  step.value = Math.max(step.value, 2)
}

onMounted(() => {
  snapshots.value = loadSnapshots()
})
</script>
