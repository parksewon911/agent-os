<template>
  <section>
    <div class="page-head">
      <div>
        <h1>증권 확인</h1>
        <p>보험증권 업로드 → 보장 추출 → 리모델링 제안</p>
      </div>
      <button class="btn btn-primary" type="button" @click="runOcr">샘플 증권 분석</button>
    </div>

    <div class="grid grid-2">
      <article class="card">
        <h3>OCR 업로드</h3>
        <p class="muted">PDF/사진 업로드를 시뮬레이션합니다</p>
        <div
          class="gap-item"
          style="margin-top: 16px; min-height: 160px; place-content: center; text-align: center"
        >
          <div>
            <div style="font-size: 2rem; color: var(--accent)">▣</div>
            <div class="muted">증권을 여기에 드롭하거나 분석 버튼을 누르세요</div>
          </div>
        </div>
        <div v-if="done" class="actions">
          <span class="tag ok">OCR 완료</span>
          <span class="tag">신뢰도 94%</span>
          <RouterLink class="btn btn-primary" to="/analysis">보장분석으로 보내기</RouterLink>
        </div>
      </article>

      <article class="card">
        <h3>추출 결과</h3>
        <template v-if="done">
          <table class="table">
            <tbody>
              <tr>
                <th>보험사</th>
                <td>{{ ocrResult.insurer }}</td>
              </tr>
              <tr>
                <th>상품</th>
                <td>{{ ocrResult.product }}</td>
              </tr>
              <tr>
                <th>월 보험료</th>
                <td>{{ ocrResult.monthly.toLocaleString() }}원</td>
              </tr>
              <tr>
                <th>계약일</th>
                <td>{{ ocrResult.startDate }}</td>
              </tr>
            </tbody>
          </table>
          <div class="list-gap" style="margin-top: 12px">
            <div v-for="c in ocrResult.covers" :key="c.name" class="gap-item">
              <span>{{ c.name }}</span>
              <strong>{{ c.amount }}</strong>
            </div>
          </div>
        </template>
        <p v-else class="muted">분석 전입니다.</p>
      </article>

      <article v-if="done" class="card" style="grid-column: 1 / -1">
        <h3>리모델링 제안</h3>
        <p class="muted">기존 유지 + 부족 보장만 추가하는 효율안</p>
        <div class="grid grid-3" style="margin-top: 12px">
          <div class="gap-item" style="flex-direction: column; align-items: stretch">
            <strong>A안 · 최소 보강</strong>
            <span class="muted">암진단비 +2,000만 / 월 +1.2만</span>
          </div>
          <div class="gap-item" style="flex-direction: column; align-items: stretch">
            <strong>B안 · 표준 리모델링</strong>
            <span class="muted">암·수술·간병 / 월 +2.8만 · 추천</span>
            <span class="tag ok">AI 추천</span>
          </div>
          <div class="gap-item" style="flex-direction: column; align-items: stretch">
            <strong>C안 · 통합 전환</strong>
            <span class="muted">신규 통합상품 / 월 구조 재설계</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ocrResult } from '../data/mock.js'

const done = ref(false)
function runOcr() {
  done.value = true
}
</script>
