<template>
  <section>
    <div class="page-head">
      <div>
        <h1>Gemini AI Gem</h1>
        <p>공유된 Gemini Gem으로 상담·분석·문구를 바로 실행합니다 (Google 로그인 필요)</p>
      </div>
    </div>

    <div class="grid grid-2">
      <a
        v-for="gem in geminiGems"
        :key="gem.id"
        class="card tool-card"
        :href="gem.url"
        target="_blank"
        rel="noopener"
      >
        <div class="tag">Gemini Gem</div>
        <h3 style="margin-top: 12px">{{ gem.title }}</h3>
        <p class="muted">{{ gem.desc }}</p>
        <div class="actions" style="margin-top: 14px">
          <span class="btn btn-primary">Gem 열기 →</span>
        </div>
      </a>
    </div>

    <article class="card" style="margin-top: 16px">
      <h3>앱 안 비서와 함께 쓰기</h3>
      <p class="muted">Gem으로 초안을 만든 뒤, 앱의 AI 상담 비서·후속 메시지 화면에 붙여 넣어 고객별로 저장하세요.</p>
      <div class="actions">
        <RouterLink class="btn btn-ghost" to="/assistant">AI 상담 비서</RouterLink>
        <RouterLink class="btn btn-ghost" to="/materials">후속 메시지</RouterLink>
        <RouterLink class="btn btn-ghost" to="/analysis">AI 보장분석</RouterLink>
      </div>
    </article>
  </section>
</template>

<script setup>
import { geminiGems } from '../data/externalTools.js'
</script>
