<template>
  <section>
    <div class="page-head">
      <div>
        <h1>Gemini AI</h1>
        <p>앱 내 Gemini 채팅 + 공유 Gem 바로가기</p>
      </div>
    </div>

    <article class="card" style="margin-bottom: 16px">
      <h3>앱 연동 채팅 <span class="tag">API</span></h3>
      <div class="chat" style="margin-top: 12px">
        <div v-for="(m, i) in messages" :key="i" class="bubble" :class="m.role">{{ m.text }}</div>
      </div>
      <div class="field" style="margin-top: 14px">
        <input v-model="input" placeholder="질문을 입력하세요" :disabled="busy" @keyup.enter="send" />
      </div>
      <button class="btn btn-primary" type="button" :disabled="busy" @click="send">
        {{ busy ? '응답 중…' : '보내기' }}
      </button>
      <p v-if="error" style="color: var(--danger); margin-top: 8px">{{ error }}</p>
    </article>

    <div class="grid grid-2">
      <a
        v-for="gem in geminiGems"
        :key="gem.id"
        class="card tool-card"
        :href="gem.url"
        target="_blank"
        rel="noopener"
      >
        <div class="tag">공유 Gem</div>
        <h3 style="margin-top: 12px">{{ gem.title }}</h3>
        <p class="muted">{{ gem.desc }}</p>
        <div class="actions" style="margin-top: 14px">
          <span class="btn btn-ghost">Gem 열기 →</span>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { geminiGems } from '../data/externalTools.js'
import { askGemini } from '../services/gemini.js'

const input = ref('')
const busy = ref(false)
const error = ref('')
const messages = ref([
  { role: 'ai', text: '설계사 AI Gemini입니다. 보장·상담·후속 문구를 도와드릴게요.' },
])

async function send() {
  const q = input.value.trim()
  if (!q || busy.value) return
  messages.value.push({ role: 'user', text: q })
  input.value = ''
  busy.value = true
  error.value = ''
  try {
    const history = messages.value.slice(0, -1).map((m) => ({ role: m.role, text: m.text }))
    const text = await askGemini({ prompt: q, history })
    messages.value.push({ role: 'ai', text })
  } catch (e) {
    error.value = e.message
  } finally {
    busy.value = false
  }
}
</script>
