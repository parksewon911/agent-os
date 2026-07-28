<template>
  <section>
    <div class="page-head">
      <div>
        <h1>보험상품 비교 엔진</h1>
        <p>보장 · 보험료 · 갱신 구조를 한 화면에서 비교</p>
      </div>
      <button class="btn btn-primary" type="button">비교표 내보내기</button>
    </div>

    <article class="card">
      <div class="field" style="max-width: 280px">
        <label>비교 유형</label>
        <select v-model="type">
          <option>전체</option>
          <option>실손</option>
          <option>종합</option>
          <option>암</option>
          <option>운전자</option>
        </select>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>보험사</th>
            <th>상품</th>
            <th>유형</th>
            <th>월 보험료</th>
            <th>AI 적합도</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filtered" :key="p.name">
            <td>{{ p.company }}</td>
            <td>{{ p.name }}</td>
            <td><span class="tag">{{ p.type }}</span></td>
            <td>{{ p.premium.toLocaleString() }}원</td>
            <td>
              <div class="score-ring" :style="{ '--p': p.score }">
                <span>{{ p.score }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { products } from '../data/mock.js'

const type = ref('전체')
const filtered = computed(() =>
  type.value === '전체' ? products : products.filter((p) => p.type === type.value),
)
</script>
