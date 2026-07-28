<template>
  <section>
    <div class="page-head">
      <div>
        <h1>Gemini AI Gem</h1>
        <p>Google Gemini 공유 Gem · 응답 데이터는 Google 계정/모델에서 생성됩니다</p>
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
      <h3>앱과 함께 쓰기</h3>
      <p class="muted">
        Gem 초안 → 앱의 AI 상담 비서·후속 메시지·보장분석에 붙여 고객별로 저장하세요.
        소속/직함은 직접 입력한 내용만 사용합니다.
      </p>
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
