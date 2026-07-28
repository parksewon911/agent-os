<template>
  <section>
    <div class="page-head">
      <div>
        <h1>AI 상담 비서</h1>
        <p>상담 중 질문 답변 · 스크립트 제안 · 기록 자동 요약</p>
      </div>
      <button class="btn btn-primary" type="button" @click="summarize">상담 기록 요약</button>
    </div>

    <div class="grid grid-2">
      <article class="card">
        <h3>실시간 비서</h3>
        <div class="chat" style="margin-top: 12px">
          <div v-for="(m, i) in messages" :key="i" class="bubble" :class="m.role">
            {{ m.text }}
          </div>
        </div>
        <div class="field" style="margin-top: 14px">
          <input
            v-model="input"
            placeholder="고객 상황이나 질문을 입력하세요"
            @keyup.enter="ask"
          />
        </div>
        <button class="btn btn-teal" type="button" @click="ask">AI에게 묻기</button>
      </article>

      <article class="card">
        <h3>상담 기록 자동 요약</h3>
        <p class="muted">녹취/메모를 붙여넣으면 핵심만 정리합니다</p>
        <div class="field" style="margin-top: 12px">
          <textarea v-model="raw" />
        </div>
        <div v-if="summary" class="gap-item" style="flex-direction: column; align-items: stretch">
          <strong>요약 결과</strong>
          <p style="margin: 0; line-height: 1.55; white-space: pre-wrap">{{ summary }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { consultTranscript } from '../data/mock.js'

const input = ref('')
const raw = ref(consultTranscript.trim())
const summary = ref('')
const messages = ref([
  {
    role: 'ai',
    text: '안녕하세요. 오늘 상담 포인트를 정리해 드릴게요. 고객 연령·가족구성·기존 증권을 알려주시면 맞춤 스크립트를 제안합니다.',
  },
])

function ask() {
  const q = input.value.trim()
  if (!q) return
  messages.value.push({ role: 'user', text: q })
  input.value = ''
  messages.value.push({
    role: 'ai',
    text: `「${q}」 기준으로 보면, ①실손 갱신 부담 설명 ②암·간병 공백 제시 ③월 3만 원대 리모델링안 비교가 효과적입니다. 필요하면 상담자료 PDF도 바로 만들어 드릴까요?`,
  })
}

function summarize() {
  summary.value = `• 고객 고민: 실손 보험료 인상, 자녀 병원비, 암 보장 불안
• 니즈: 기존 증권 점검 + 암·수술·간병 보강
• 다음 액션: 증권 OCR 분석 → 리모델링 2안 제시 → 3일 내 카톡 후속
• 톤: 부담 덜어주는 설명, 숫자 비교 중심`
}
</script>
