<template>
  <section>
    <div class="page-head">
      <div>
        <h1>AI 보장분석</h1>
        <p>
          PDF 업로드 → 자동 분석 → Before/After 리포트 ·
          <a :href="analysisTool.url" target="_blank" rel="noopener">PRO AI 보장분석표</a> 흐름 참고
        </p>
      </div>
      <div class="actions">
        <a class="btn btn-teal" :href="analysisTool.url" target="_blank" rel="noopener">프로 보장분석 열기</a>
        <button class="btn btn-primary" type="button" @click="runAnalysis">분석 실행</button>
      </div>
    </div>

    <div class="steps-row">
      <div class="step-chip" :class="{ on: step >= 1 }"><span>1</span> 업로드</div>
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
            <input v-model="form.agent" />
          </div>
          <div class="field">
            <label>분석 일자</label>
            <input v-model="form.date" type="date" />
          </div>
        </div>
      </article>

      <article class="card">
        <h3>주요 리스크 지표</h3>
        <div class="list-gap">
          <div v-for="r in risks" :key="r.label" class="gap-item">
            <div>
              <strong>{{ r.label }}</strong>
              <div class="muted">{{ r.note }}</div>
            </div>
            <span class="tag" :class="r.ok ? 'ok' : 'warn'">{{ r.ok ? '양호' : '주의' }}</span>
          </div>
        </div>
      </article>
    </div>

    <div class="grid grid-2" style="margin-bottom: 16px">
      <article class="card">
        <h3>기존 보험 (Before)</h3>
        <p class="muted">보장분석 PDF 업로드 · 전 보험사 지원</p>
        <div class="drop-zone" @click="step = Math.max(step, 1)">
          <div style="font-size: 1.6rem; color: var(--accent)">▣</div>
          <div>기존 증권·보장분석 PDF를 여기에 드롭</div>
          <div class="muted">클릭하여 샘플 데이터 로드</div>
        </div>
        <table v-if="analyzed" class="table" style="margin-top: 12px">
          <thead>
            <tr>
              <th>상품</th>
              <th>월 보험료</th>
              <th>핵심 담보</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in beforeProducts" :key="p.name">
              <td>{{ p.name }}</td>
              <td>{{ p.premium.toLocaleString() }}원</td>
              <td>{{ p.cover }}</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="card">
        <h3>제안 보험 (After)</h3>
        <p class="muted">가입 제안서 PDF → AI 담보 분석</p>
        <div class="drop-zone" @click="step = Math.max(step, 2)">
          <div style="font-size: 1.6rem; color: var(--teal)">◇</div>
          <div>가입 제안서 PDF를 여기에 드롭</div>
          <div class="muted">클릭하여 제안안 로드</div>
        </div>
        <table v-if="analyzed" class="table" style="margin-top: 12px">
          <thead>
            <tr>
              <th>상품</th>
              <th>월 보험료</th>
              <th>보강 포인트</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in afterProducts" :key="p.name">
              <td>{{ p.name }}</td>
              <td>{{ p.premium.toLocaleString() }}원</td>
              <td>{{ p.cover }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>

    <article v-if="analyzed" class="card">
      <h3>담보별 상세 변화 · AI 종합 의견</h3>
      <div class="grid grid-3" style="margin-top: 12px">
        <div v-for="c in coverChanges" :key="c.name" class="gap-item" style="flex-direction: column; align-items: stretch">
          <strong>{{ c.name }}</strong>
          <span class="muted">{{ c.before }} → {{ c.after }}</span>
          <span class="tag" :class="c.up ? 'ok' : ''">{{ c.up ? '보강' : '유지' }}</span>
        </div>
      </div>
      <p style="margin: 16px 0 0; line-height: 1.6">
        {{ aiOpinion }}
      </p>
      <div class="actions" style="margin-top: 14px">
        <button class="btn btn-ghost" type="button">간편 리포트</button>
        <button class="btn btn-ghost" type="button">종합 보장분석 리포트</button>
        <a class="btn btn-primary" :href="analysisTool.url" target="_blank" rel="noopener">프로에서 정식 리포트</a>
      </div>
    </article>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { analysisTool } from '../data/externalTools.js'

const step = ref(0)
const analyzed = ref(false)

const form = reactive({
  contractor: '김민수',
  insured: '김민수',
  age: 42,
  gender: '남성',
  agent: '박설계',
  date: new Date().toISOString().slice(0, 10),
})

const risks = ref([
  { label: '갱신형 비중', note: '실손·일부 특약 갱신형', ok: false },
  { label: '보장 범위 적정성', note: '암·수술 일부 부족', ok: false },
  { label: '만기 설정 리스크', note: '종신/100세 혼합 양호', ok: true },
])

const beforeProducts = [
  { name: 'A손보 실손의료비', premium: 48000, cover: '실손 4세대' },
  { name: 'B생명 종신', premium: 120000, cover: '사망 1억' },
  { name: 'C손보 암보험', premium: 35000, cover: '암진단 3천만' },
]

const afterProducts = [
  { name: '통합건강보험 (제안)', premium: 89000, cover: '암+수술+입원 보강' },
  { name: '실손 유지', premium: 48000, cover: '기존 유지' },
  { name: '종신 유지+특약', premium: 128000, cover: 'CI 특약 추가' },
]

const coverChanges = [
  { name: '암 진단비', before: '3,000만', after: '5,000만', up: true },
  { name: '수술비', before: '없음/미흡', after: '1회 200만', up: true },
  { name: '실손', before: '4세대', after: '4세대 유지', up: false },
  { name: '사망', before: '1억', after: '1억', up: false },
  { name: '간병', before: '공백', after: '일 10만×90일', up: true },
  { name: '월 합계', before: '20.3만', after: '26.5만', up: true },
]

const aiOpinion =
  '기존 보장은 사망·실손 중심으로 양호하나, 암 진단비와 수술·간병 공백이 큽니다. 제안안은 월 +6.2만 원 수준에서 핵심 리스크를 메우며, 갱신형 비중은 실손만 유지하는 방향이 안정적입니다.'

function runAnalysis() {
  step.value = 3
  analyzed.value = true
  risks.value = [
    { label: '갱신형 비중', note: '실손만 갱신 · 개선', ok: true },
    { label: '보장 범위 적정성', note: '암·수술·간병 보강', ok: true },
    { label: '만기 설정 리스크', note: '만기 구조 양호', ok: true },
  ]
}
</script>
