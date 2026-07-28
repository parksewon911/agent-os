<template>
  <section>
    <div class="page-head">
      <div>
        <h1>금융계산기</h1>
        <p>클라이언트 공식 계산 · 환율은 공개 API · 참고 도구의 카테고리 구조를 이식</p>
      </div>
    </div>

    <div class="steps-row" style="margin-bottom: 16px">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="step-chip"
        :class="{ on: active === tab.id }"
        @click="active = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <article v-if="active === 'savings'" class="card">
      <h3>예적금 계산기</h3>
      <div class="grid grid-2">
        <div>
          <div class="field">
            <label>예치 금액 (원)</label>
            <input v-model.number="dep.principal" type="number" />
          </div>
          <div class="field">
            <label>연 이율 (%)</label>
            <input v-model.number="dep.rate" type="number" step="0.1" />
          </div>
          <div class="field">
            <label>기간 (년)</label>
            <input v-model.number="dep.years" type="number" />
          </div>
          <div class="field">
            <label>과세</label>
            <select v-model="dep.taxKey">
              <option value="normal">일반과세 15.4%</option>
              <option value="reduced">세금우대 9.5%</option>
              <option value="free">비과세</option>
            </select>
          </div>
        </div>
        <div class="list-gap">
          <div class="gap-item"><span>세전 이자</span><strong>{{ depOut.preTax.toLocaleString() }}원</strong></div>
          <div class="gap-item"><span>세후 이자</span><strong>{{ depOut.afterTax.toLocaleString() }}원</strong></div>
          <div class="gap-item"><span>만기 수령액</span><strong>{{ depOut.maturity.toLocaleString() }}원</strong></div>
        </div>
      </div>
    </article>

    <article v-else-if="active === 'loan'" class="card">
      <h3>대출 상환 비교</h3>
      <div class="grid grid-2">
        <div>
          <div class="field"><label>원금</label><input v-model.number="loan.principal" type="number" /></div>
          <div class="field"><label>연 이율 %</label><input v-model.number="loan.annualRate" type="number" step="0.1" /></div>
          <div class="field"><label>기간 (년)</label><input v-model.number="loan.years" type="number" /></div>
        </div>
        <div class="list-gap">
          <div class="gap-item"><span>원리금균등 월납</span><strong>{{ loanOut.equalPayment.toLocaleString() }}원</strong></div>
          <div class="gap-item"><span>원금균등 초회</span><strong>{{ loanOut.firstEqualPrincipal.toLocaleString() }}원</strong></div>
          <div class="gap-item"><span>만기일시 월이자</span><strong>{{ loanOut.interestOnly.toLocaleString() }}원</strong></div>
        </div>
      </div>
    </article>

    <article v-else-if="active === 'renewal'" class="card">
      <h3>갱신형 vs 비갱신형</h3>
      <div class="grid grid-2">
        <div>
          <div class="field"><label>갱신형 월 보험료</label><input v-model.number="ren.renewMonthly" type="number" /></div>
          <div class="field"><label>연 인상률 %</label><input v-model.number="ren.renewRate" type="number" step="0.5" /></div>
          <div class="field"><label>보장 잔여 (년)</label><input v-model.number="ren.years" type="number" /></div>
          <div class="field"><label>비갱신 월 보험료</label><input v-model.number="ren.fixedMonthly" type="number" /></div>
          <div class="field"><label>비갱신 납입기간 (년)</label><input v-model.number="ren.fixedPayYears" type="number" /></div>
        </div>
        <div class="list-gap">
          <div class="gap-item"><span>갱신형 총납(추정)</span><strong>{{ renOut.renewTotal.toLocaleString() }}원</strong></div>
          <div class="gap-item"><span>비갱신 총납</span><strong>{{ renOut.fixedTotal.toLocaleString() }}원</strong></div>
          <div class="gap-item">
            <span>차이</span>
            <strong>{{ Math.abs(renOut.diff).toLocaleString() }}원
              {{ renOut.diff > 0 ? '(비갱신 유리)' : '(갱신 유리)' }}</strong>
          </div>
        </div>
      </div>
    </article>

    <article v-else-if="active === 'silson'" class="card">
      <h3>실손 갱신 시뮬레이션</h3>
      <div class="grid grid-2">
        <div>
          <div class="field"><label>현재 월 보험료</label><input v-model.number="sil.monthly" type="number" /></div>
          <div class="field"><label>현재 나이</label><input v-model.number="sil.age" type="number" /></div>
          <div class="field"><label>보장 만기 나이</label><input v-model.number="sil.endAge" type="number" /></div>
          <div class="field"><label>연 인상률 %</label><input v-model.number="sil.annualIncrease" type="number" step="0.5" /></div>
        </div>
        <div style="max-height: 280px; overflow: auto">
          <table class="table">
            <thead><tr><th>나이</th><th>월 보험료</th><th>누적</th></tr></thead>
            <tbody>
              <tr v-for="row in silRows.filter((_, i) => i % 5 === 0 || i === silRows.length - 1)" :key="row.age">
                <td>{{ row.age }}</td>
                <td>{{ row.monthly.toLocaleString() }}</td>
                <td>{{ row.total.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </article>

    <article v-else class="card">
      <h3>달러 설계 (환율 연동)</h3>
      <p class="muted">
        참고 사이트의 /api/rate(네이버)와 같이 환율을 불러옵니다 · 현재
        {{ fx.rate }}원/USD ({{ fx.source }})
      </p>
      <div class="actions" style="margin-bottom: 12px">
        <button class="btn btn-ghost" type="button" @click="refreshFx">환율 새로고침</button>
      </div>
      <div class="grid grid-2">
        <div>
          <div class="field"><label>월 납입 ($)</label><input v-model.number="dol.usdMonthly" type="number" /></div>
          <div class="field"><label>추가납입 ($)</label><input v-model.number="dol.extraUsd" type="number" /></div>
        </div>
        <div class="list-gap">
          <div class="gap-item"><span>월 달러</span><strong>${{ dolOut.usd }}</strong></div>
          <div class="gap-item"><span>원화 환산</span><strong>{{ dolOut.krw.toLocaleString() }}원</strong></div>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  calcDeposit,
  calcDollarPremium,
  calcLoan,
  calcRenewalCompare,
  calcSilsonProjection,
} from '../services/financeFormulas.js'
import { fetchUsdKrw } from '../services/fxRate.js'

const tabs = [
  { id: 'savings', label: '예적금' },
  { id: 'loan', label: '대출' },
  { id: 'renewal', label: '갱신형비교' },
  { id: 'silson', label: '실손갱신' },
  { id: 'dollar', label: '달러설계' },
]
const active = ref('savings')

const dep = reactive({ principal: 10000000, rate: 3.5, years: 3, taxKey: 'normal' })
const depOut = computed(() => calcDeposit(dep))

const loan = reactive({ principal: 300000000, annualRate: 4, years: 30 })
const loanOut = computed(() => calcLoan(loan))

const ren = reactive({
  renewMonthly: 45000,
  renewRate: 8,
  years: 20,
  fixedMonthly: 78000,
  fixedPayYears: 20,
})
const renOut = computed(() => calcRenewalCompare(ren))

const sil = reactive({ monthly: 35000, age: 40, endAge: 100, annualIncrease: 9 })
const silRows = computed(() => calcSilsonProjection(sil))

const fx = reactive({ rate: 1380, source: 'fallback', timestamp: '' })
const dol = reactive({ usdMonthly: 200, extraUsd: 0 })
const dolOut = computed(() =>
  calcDollarPremium({ usdMonthly: dol.usdMonthly, extraUsd: dol.extraUsd, fxRate: fx.rate }),
)

async function refreshFx() {
  const r = await fetchUsdKrw()
  fx.rate = r.rate
  fx.source = r.source
  fx.timestamp = r.timestamp
}

onMounted(refreshFx)
</script>
