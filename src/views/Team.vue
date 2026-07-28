<template>
  <section>
    <div class="page-head">
      <div>
        <h1>팀 실적 · 상담 현황</h1>
        <p>팀원별 상담 · 성약 · 활동 점수를 한눈에</p>
      </div>
    </div>

    <div class="grid grid-4" style="margin-bottom: 16px">
      <article class="card">
        <div class="muted">팀 상담</div>
        <div class="stat-value">{{ totalConsults }}</div>
      </article>
      <article class="card">
        <div class="muted">팀 성약</div>
        <div class="stat-value">{{ totalCloses }}</div>
      </article>
      <article class="card">
        <div class="muted">성약률</div>
        <div class="stat-value">{{ closeRate }}%</div>
      </article>
      <article class="card">
        <div class="muted">평균 활동점수</div>
        <div class="stat-value">{{ avgScore }}</div>
      </article>
    </div>

    <article class="card">
      <table class="table">
        <thead>
          <tr>
            <th>설계사</th>
            <th>상담</th>
            <th>성약</th>
            <th>활동 점수</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in teamStats" :key="t.name">
            <td>{{ t.name }}</td>
            <td>{{ t.consults }}</td>
            <td>{{ t.closes }}</td>
            <td>
              <div class="score-ring" :style="{ '--p': t.score }">
                <span>{{ t.score }}</span>
              </div>
            </td>
            <td>
              <span class="tag" :class="t.score >= 85 ? 'ok' : ''">{{
                t.score >= 85 ? '우수' : '관리'
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { teamStats } from '../data/mock.js'

const totalConsults = computed(() => teamStats.reduce((s, t) => s + t.consults, 0))
const totalCloses = computed(() => teamStats.reduce((s, t) => s + t.closes, 0))
const closeRate = computed(() => Math.round((totalCloses.value / totalConsults.value) * 100))
const avgScore = computed(() =>
  Math.round(teamStats.reduce((s, t) => s + t.score, 0) / teamStats.length),
)
</script>
