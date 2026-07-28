<template>
  <section>
    <div class="page-head">
      <div>
        <h1>고객 관리</h1>
        <p>보험설계사 전용 · 상담 이력 · 보장 공백 · 계약 점수를 고객 단위로 관리</p>
      </div>
      <button class="btn btn-primary" type="button">고객 추가</button>
    </div>

    <div class="grid grid-2">
      <article class="card" style="grid-column: 1 / -1">
        <table class="table">
          <thead>
            <tr>
              <th>고객</th>
              <th>연락처</th>
              <th>단계</th>
              <th>보유증권</th>
              <th>부족 보장</th>
              <th>계약 점수</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in customers"
              :key="c.id"
              style="cursor: pointer"
              @click="selected = c"
            >
              <td>
                <strong>{{ c.name }}</strong>
                <div class="muted">{{ c.age }}세</div>
              </td>
              <td>{{ c.phone }}</td>
              <td><span class="tag">{{ c.stage }}</span></td>
              <td>{{ c.policies }}건</td>
              <td>{{ c.gaps[0] }}</td>
              <td>
                <div class="score-ring" :style="{ '--p': c.score }">
                  <span>{{ c.score }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </article>

      <article v-if="selected" class="card">
        <h3>{{ selected.name }} 상세</h3>
        <p class="muted">최근 연락 {{ selected.lastContact }}</p>
        <div class="list-gap" style="margin-top: 14px">
          <div v-for="g in selected.gaps" :key="g" class="gap-item">
            <span>{{ g }}</span>
            <span class="tag warn">보완 필요</span>
          </div>
        </div>
        <div class="actions">
          <RouterLink class="btn btn-teal" to="/coverage">보장 진단</RouterLink>
          <RouterLink class="btn btn-ghost" to="/assistant">AI 비서</RouterLink>
        </div>
      </article>

      <article class="card">
        <h3>CRM 파이프라인</h3>
        <p class="muted">초회 → 상담 → 제안 → 성약 / 소개</p>
        <div class="list-gap" style="margin-top: 14px">
          <div v-for="stage in stages" :key="stage.name" class="gap-item">
            <span>{{ stage.name }}</span>
            <strong>{{ stage.count }}명</strong>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { customers } from '../data/mock.js'

const selected = ref(customers[0])
const stages = computed(() => {
  const map = {}
  for (const c of customers) map[c.stage] = (map[c.stage] || 0) + 1
  return Object.entries(map).map(([name, count]) => ({ name, count }))
})
</script>
