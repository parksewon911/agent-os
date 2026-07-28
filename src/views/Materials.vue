<template>
  <section>
    <div class="page-head">
      <div>
        <h1>상담자료 · 후속 메시지</h1>
        <p>상담 PDF 자동 생성 · 카카오톡/문자 후속 문구 작성</p>
      </div>
    </div>

    <div class="grid grid-2">
      <article class="card">
        <h3>상담자료 PDF</h3>
        <div class="field">
          <label>고객</label>
          <select v-model="customerId">
            <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="field">
          <label>포함할 내용</label>
          <div class="list-gap">
            <label v-for="opt in pdfOpts" :key="opt" style="display: flex; gap: 8px; color: var(--text)">
              <input v-model="selectedOpts" type="checkbox" :value="opt" />
              {{ opt }}
            </label>
          </div>
        </div>
        <button class="btn btn-primary" type="button" @click="pdfReady = true">PDF 생성</button>
        <p v-if="pdfReady" class="muted" style="margin-top: 12px">
          ✓ {{ customer.name }}_상담자료_{{ today }}.pdf 준비 완료 (프로토타입)
        </p>
      </article>

      <article class="card">
        <h3>카카오톡 · 문자 후속</h3>
        <div class="field">
          <label>채널</label>
          <select v-model="channel">
            <option>카카오톡</option>
            <option>문자(SMS)</option>
          </select>
        </div>
        <div class="field">
          <label>목적</label>
          <select v-model="purpose">
            <option>상담 감사 + 요약</option>
            <option>리모델링안 공유</option>
            <option>소개 요청</option>
            <option>미팅 리마인드</option>
          </select>
        </div>
        <button class="btn btn-teal" type="button" @click="draftMessage">메시지 자동 작성</button>
        <div v-if="message" class="gap-item" style="margin-top: 14px; flex-direction: column; align-items: stretch">
          <strong>{{ channel }} 초안</strong>
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.55">{{ message }}</p>
          <button class="btn btn-ghost" type="button" @click="copied = true">
            {{ copied ? '복사됨' : '복사' }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { customers } from '../data/mock.js'

const customerId = ref(customers[0].id)
const customer = computed(() => customers.find((c) => c.id === customerId.value))
const pdfOpts = ['현재 보장 요약', '부족 보장', '리모델링 비교', '월 보험료 시뮬레이션']
const selectedOpts = ref([...pdfOpts])
const pdfReady = ref(false)
const channel = ref('카카오톡')
const purpose = ref('상담 감사 + 요약')
const message = ref('')
const copied = ref(false)
const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')

function draftMessage() {
  copied.value = false
  message.value = `${customer.value.name}님, 안녕하세요. 설계사 AI 도우미입니다.
어제 상담 내용을 짧게 정리해 드렸어요.

• ${purpose.value}
• 부족한 보장: ${customer.value.gaps.join(', ')}
• 제안 점수(계약 가능성): ${customer.value.score}점

편하신 시간에 답장 주시면 조율안을 바로 보내드릴게요.`
}
</script>
