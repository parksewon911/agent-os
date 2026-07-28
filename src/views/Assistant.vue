<template>
  <section>
    <div class="page-head">
      <div>
        <h1>AI 상담 비서</h1>
        <p>Gemini 연동 · 상담 스크립트 · 기록 자동 요약</p>
      </div>
      <button class="btn btn-primary" type="button" :disabled="busy" @click="summarize">
        {{ busy && mode === 'summary' ? '요약 중…' : '상담 기록 요약' }}
      </button>
    </div>

    <p v-if="error" class="card" style="color: var(--danger); margin-bottom: 16px">{{ error }}</p>

    <div class="grid grid-2">
      <article class="card">
        <h3>실시간 비서 <span class="tag">Gemini</span></h3>
        <div class="chat" style="margin-top: 12px">
          <div v-for="(m, i) in messages" :key="i" class="bubble" :class="m.role">
            {{ m.text }}
          </div>
        </div>
        <div class="field" style="margin-top: 14px">
          <input
            v-model="input"
            placeholder="고객 상황이나 질문을 입력하세요"
            :disabled="busy"
            @keyup.enter="ask"
          />
        </div>
        <button class="btn btn-teal" type="button" :disabled="busy" @click="ask">
          {{ busy && mode === 'chat' ? '답변 생성 중…' : 'Gemini에게 묻기' }}
        </button>
      </article>

      <article class="card">
        <h3>상담 기록 자동 요약</h3>
        <p class="muted">녹취/메모를 붙여넣으면 Gemini가 핵심만 정리합니다</p>
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
import { askGemini } from '../services/gemini.js'

const input = ref('')
const raw = ref(consultTranscript.trim())
const summary = ref('')
const error = ref('')
const busy = ref(false)
const mode = ref('')
const messages = ref([
  {
    role: 'ai',
    text: '안녕하세요. Gemini 상담 비서입니다. 고객 연령·가족구성·기존 증권을 알려주시면 맞춤 스크립트를 제안합니다.',
  },
])

async function ask() {
  const q = input.value.trim()
  if (!q || busy.value) return
  messages.value.push({ role: 'user', text: q })
  input.value = ''
  busy.value = true
  mode.value = 'chat'
  error.value = ''
  try {
    const history = messages.value.slice(0, -1).map((m) => ({ role: m.role, text: m.text }))
    const text = await askGemini({
      prompt: q,
      history,
      system:
        '당신은 보험설계사 현장 상담 비서입니다. 실무 스크립트·질문·비교 포인트를 한국어로 간결히 제안하세요. 조직명·총괄 직함은 넣지 마세요.',
    })
    messages.value.push({ role: 'ai', text })
  } catch (e) {
    error.value = e.message
    messages.value.push({
      role: 'ai',
      text: '응답을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.',
    })
  } finally {
    busy.value = false
    mode.value = ''
  }
}

async function summarize() {
  if (busy.value) return
  busy.value = true
  mode.value = 'summary'
  error.value = ''
  try {
    summary.value = await askGemini({
      prompt: `다음 상담 메모/녹취를 설계사용으로 요약하세요.\n형식:\n• 고객 고민\n• 니즈\n• 다음 액션\n• 권장 톤\n\n---\n${raw.value}`,
    })
  } catch (e) {
    error.value = e.message
  } finally {
    busy.value = false
    mode.value = ''
  }
}
</script>
