<template>
  <section>
    <div class="page-head">
      <div>
        <h1>금융계산기</h1>
        <p>
          AI 실시간 시뮬레이션 ·
          <a :href="calculatorTool.url" target="_blank" rel="noopener">PRO Calculator</a> 참고
        </p>
      </div>
      <a class="btn btn-primary" :href="calculatorTool.url" target="_blank" rel="noopener"
        >프로 계산기 열기</a
      >
    </div>

    <article class="card" style="margin-bottom: 16px">
      <h3>금융 솔루션 카테고리</h3>
      <p class="muted">항목을 누르면 프로 계산기로 이동합니다. 숫자 변경 시 실시간 결과 업데이트.</p>
      <div class="tool-grid">
        <a
          v-for="cat in calculatorTool.categories"
          :key="cat"
          class="tool-tile"
          :href="calculatorTool.url"
          target="_blank"
          rel="noopener"
        >
          {{ cat }}
        </a>
      </div>
    </article>

    <div class="grid grid-2">
      <article class="card">
        <h3>빠른 예적금 (데모)</h3>
        <div class="field">
          <label>예치 금액 (원)</label>
          <input v-model.number="deposit.principal" type="number" />
        </div>
        <div class="field">
          <label>연 이율 (%)</label>
          <input v-model.number="deposit.rate" type="number" step="0.1" />
        </div>
        <div class="field">
          <label>예치 기간 (년)</label>
          <input v-model.number="deposit.years" type="number" />
        </div>
        <div class="grid grid-3">
          <div>
            <div class="muted">세전 이자</div>
            <div class="stat-value" style="font-size: 1.2rem">{{ preTaxInterest.toLocaleString() }}</div>
          </div>
          <div>
            <div class="muted">세후 이자 (15.4%)</div>
            <div class="stat-value" style="font-size: 1.2rem">{{ afterTaxInterest.toLocaleString() }}</div>
          </div>
          <div>
            <div class="muted">만기 수령액</div>
            <div class="stat-value" style="font-size: 1.2rem">{{ maturity.toLocaleString() }}</div>
          </div>
        </div>
      </article>

      <article class="card">
        <h3>갱신형 vs 비갱신형 (데모)</h3>
        <div class="field">
          <label>갱신형 월 보험료 (원)</label>
          <input v-model.number="renew.monthly" type="number" />
        </div>
        <div class="field">
          <label>평균 갱신 상승률 (%/년)</label>
          <input v-model.number="renew.rate" type="number" step="0.5" />
        </div>
        <div class="field">
          <label>남은 기간 (년)</label>
          <input v-model.number="renew.years" type="number" />
        </div>
        <div class="field">
          <label>비갱신형 월 보험료 (원)</label>
          <input v-model.number="renew.fixed" type="number" />
        </div>
        <div class="list-gap">
          <div class="gap-item">
            <span>갱신형 총 납입(추정)</span>
            <strong>{{ renewTotal.toLocaleString() }}원</strong>
          </div>
          <div class="gap-item">
            <span>비갱신형 총 납입</span>
            <strong>{{ fixedTotal.toLocaleString() }}원</strong>
          </div>
          <div class="gap-item">
            <span>차이</span>
            <strong :style="{ color: renewTotal > fixedTotal ? 'var(--danger)' : 'var(--ok)' }">
              {{ Math.abs(renewTotal - fixedTotal).toLocaleString() }}원
              {{ renewTotal > fixedTotal ? '(비갱신 유리)' : '(갱신 유리)' }}
            </strong>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { calculatorTool } from '../data/externalTools.js'

const deposit = reactive({
  principal: 10000000,
  rate: 3.5,
  years: 3,
})

const preTaxInterest = computed(() =>
  Math.round(deposit.principal * (deposit.rate / 100) * deposit.years),
)
const afterTaxInterest = computed(() => Math.round(preTaxInterest.value * (1 - 0.154)))
const maturity = computed(() => deposit.principal + afterTaxInterest.value)

const renew = reactive({
  monthly: 45000,
  rate: 8,
  years: 20,
  fixed: 78000,
})

const renewTotal = computed(() => {
  let m = renew.monthly
  let total = 0
  for (let y = 0; y < renew.years; y++) {
    total += m * 12
    m *= 1 + renew.rate / 100
  }
  return Math.round(total)
})

const fixedTotal = computed(() => renew.fixed * 12 * Math.min(renew.years, 20))
</script>
