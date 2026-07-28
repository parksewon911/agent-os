<template>
  <section>
    <div class="page-head">
      <div>
        <h1>부족 보장 자동 진단</h1>
        <p>고객별 가족·소득·기존 보장 기준으로 공백을 찾아줍니다</p>
      </div>
      <button class="btn btn-primary" type="button" @click="run = true">진단 실행</button>
    </div>

    <div class="grid grid-2">
      <article class="card">
        <h3>고객 선택</h3>
        <div class="field">
          <label>고객</label>
          <select v-model="customerId">
            <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="field">
          <label>월 소득(만원)</label>
          <input v-model.number="income" type="number" />
        </div>
        <div class="field">
          <label>부양가족</label>
          <input v-model.number="family" type="number" />
        </div>
      </article>

      <article class="card">
        <h3>진단 결과</h3>
        <template v-if="run">
          <div class="list-gap">
            <div v-for="item in diagnosis" :key="item.title" class="gap-item">
              <div>
                <strong>{{ item.title }}</strong>
                <div class="muted">{{ item.desc }}</div>
              </div>
              <span class="tag" :class="item.level">{{ item.level === 'warn' ? '높음' : '보통' }}</span>
            </div>
          </div>
        </template>
        <p v-else class="muted">진단을 실행하면 결과가 표시됩니다.</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { customers } from '../data/mock.js'

const customerId = ref(customers[0].id)
const income = ref(450)
const family = ref(4)
const run = ref(false)

const customer = computed(() => customers.find((c) => c.id === customerId.value))

const diagnosis = computed(() => [
  {
    title: '사망/가장 보장',
    desc: `권장 ${(income.value * 36).toLocaleString()}만 원 대비 현재 부족`,
    level: 'warn',
  },
  {
    title: '암 진단비',
    desc: customer.value.gaps.find((g) => g.includes('암')) || '적정 수준에 근접',
    level: customer.value.gaps.some((g) => g.includes('암')) ? 'warn' : 'ok',
  },
  {
    title: '실손·갱신 리스크',
    desc: '갱신형 비중 높음 · 일부 비갱신 전환 검토',
    level: 'warn',
  },
  {
    title: '자녀/간병',
    desc: `부양 ${family.value}인 기준 간병·수술비 보강 권장`,
    level: 'ok',
  },
])
</script>
