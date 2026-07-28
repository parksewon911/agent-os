<template>
  <section>
    <div class="page-head">
      <div>
        <h1>소개 요청 · 계약 가능성</h1>
        <p>소개 요청 시점 추천과 계약 가능성 AI 점수</p>
      </div>
    </div>

    <div class="grid grid-2">
      <article class="card">
        <h3>계약 가능성 점수</h3>
        <div class="list-gap" style="margin-top: 12px">
          <div v-for="c in customers" :key="c.id" class="gap-item">
            <div>
              <strong>{{ c.name }}</strong>
              <div class="muted">{{ c.stage }} · 최근 {{ c.lastContact }}</div>
            </div>
            <div class="score-ring" :style="{ '--p': c.score }">
              <span>{{ c.score }}</span>
            </div>
          </div>
        </div>
      </article>

      <article class="card">
        <h3>소개 요청 시점 추천</h3>
        <p class="muted">신뢰·만족·후속 반응을 종합한 타이밍</p>
        <div class="list-gap" style="margin-top: 12px">
          <div v-for="tip in tips" :key="tip.name" class="gap-item" style="flex-direction: column; align-items: stretch">
            <div style="display: flex; justify-content: space-between; gap: 12px">
              <strong>{{ tip.name }}</strong>
              <span class="tag" :class="tip.ready ? 'ok' : ''">{{ tip.ready ? '지금 요청' : '대기' }}</span>
            </div>
            <span class="muted">{{ tip.reason }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { customers } from '../data/mock.js'

const tips = [
  {
    name: '이서연',
    ready: true,
    reason: '제안 수용도 높음 · 감사 메시지 응답 있음 · 지인 언급 2회',
  },
  {
    name: '김민수',
    ready: false,
    reason: '리모델링 검토 중 · 보험료 민감 · 3일 후 후속 뒤 재평가',
  },
  {
    name: '박준호',
    ready: true,
    reason: '소개대기 단계 · 자녀 또래 부모 네트워크 강점',
  },
]
</script>
