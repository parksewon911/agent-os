<template>
  <section>
    <div class="hero-banner">
      <h2>{{ brand.name }}에 오신 걸 환영합니다</h2>
      <p>{{ brand.subtitle }} · 오늘 상담 {{ todayConsults }}건 · AI 추천 후속 {{ followups }}건</p>
      <div class="actions">
        <RouterLink class="btn btn-primary" to="/analysis">AI 보장분석</RouterLink>
        <RouterLink class="btn btn-ghost" to="/calculator">금융계산기</RouterLink>
        <RouterLink class="btn btn-teal" to="/gems">Gemini AI</RouterLink>
        <RouterLink class="btn btn-ghost" to="/assistant">AI 상담 비서</RouterLink>
      </div>
    </div>

    <div class="page-head">
      <div>
        <h1>업무 대시보드</h1>
        <p>상담 · 계약 가능성 · 팀 실적을 한눈에</p>
      </div>
    </div>

    <div class="grid grid-4" style="margin-bottom: 16px">
      <article class="card">
        <div class="muted">오늘 상담</div>
        <div class="stat-value">{{ todayConsults }}</div>
      </article>
      <article class="card">
        <div class="muted">계약 가능성 평균</div>
        <div class="stat-value">{{ avgScore }}</div>
      </article>
      <article class="card">
        <div class="muted">부족 보장 알림</div>
        <div class="stat-value">{{ gapCount }}</div>
      </article>
      <article class="card">
        <div class="muted">리크루팅 지원자</div>
        <div class="stat-value">{{ applicants.length }}</div>
      </article>
    </div>

    <div class="grid grid-2">
      <article class="card">
        <h3>우선 연락 고객</h3>
        <p class="muted">계약 점수·최근 상담 기준 AI 추천</p>
        <table class="table">
          <thead>
            <tr>
              <th>고객</th>
              <th>단계</th>
              <th>점수</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in customers.slice(0, 4)" :key="c.id">
              <td>{{ c.name }}</td>
              <td><span class="tag">{{ c.stage }}</span></td>
              <td>{{ c.score }}</td>
              <td>
                <RouterLink class="btn btn-ghost" style="padding: 6px 10px" to="/materials"
                  >메시지</RouterLink
                >
              </td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="card">
        <h3>이번 주 팀 현황</h3>
        <p class="muted">상담 건수 · 성약 · 활동 점수</p>
        <table class="table">
          <thead>
            <tr>
              <th>설계사</th>
              <th>상담</th>
              <th>성약</th>
              <th>점수</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in teamStats" :key="t.name">
              <td>{{ t.name }}</td>
              <td>{{ t.consults }}</td>
              <td>{{ t.closes }}</td>
              <td>{{ t.score }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { brand } from '../config/brand.js'
import { applicants, customers, teamStats } from '../data/mock.js'

const todayConsults = 12
const followups = 7
const avgScore = computed(() =>
  Math.round(customers.reduce((s, c) => s + c.score, 0) / customers.length),
)
const gapCount = computed(() => customers.reduce((s, c) => s + c.gaps.length, 0))
</script>
