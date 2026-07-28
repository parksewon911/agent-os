<template>
  <section>
    <div class="page-head">
      <div>
        <h1>SNS 콘텐츠 자동 생성</h1>
        <p>Gemini로 인스타 · 블로그 · 카드뉴스 문구 작성</p>
      </div>
      <button class="btn btn-primary" type="button" :disabled="busy" @click="generate">
        {{ busy ? '생성 중…' : '콘텐츠 생성' }}
      </button>
    </div>

    <p v-if="error" class="card" style="color: var(--danger); margin-bottom: 16px">{{ error }}</p>

    <div class="grid grid-2">
      <article class="card">
        <div class="field">
          <label>주제</label>
          <input v-model="topic" />
        </div>
        <div class="field">
          <label>채널</label>
          <select v-model="channel">
            <option>인스타그램</option>
            <option>네이버 블로그</option>
            <option>카드뉴스</option>
          </select>
        </div>
        <div class="field">
          <label>톤</label>
          <select v-model="tone">
            <option>전문적이지만 친절하게</option>
            <option>짧고 임팩트 있게</option>
            <option>스토리텔링</option>
          </select>
        </div>
      </article>

      <article class="card">
        <h3>생성 결과 <span class="tag">Gemini</span></h3>
        <p v-if="!output" class="muted">주제를 정한 뒤 생성하세요.</p>
        <div v-else class="gap-item" style="flex-direction: column; align-items: stretch">
          <span class="tag">{{ channel }}</span>
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.6">{{ output }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { askGemini } from '../services/gemini.js'

const topic = ref('실손 보험료 인상, 어떻게 대비할까')
const channel = ref('인스타그램')
const tone = ref('전문적이지만 친절하게')
const output = ref('')
const busy = ref(false)
const error = ref('')

async function generate() {
  busy.value = true
  error.value = ''
  try {
    output.value = await askGemini({
      prompt: `${channel.value}용 SNS 콘텐츠를 작성하세요.
주제: ${topic.value}
톤: ${tone.value}
해시태그 포함. 특정 금융사 조직명·총괄 직함은 넣지 마세요.
본문만 출력.`,
    })
  } catch (e) {
    error.value = e.message
  } finally {
    busy.value = false
  }
}
</script>
