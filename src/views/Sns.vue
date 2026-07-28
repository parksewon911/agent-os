<template>
  <section>
    <div class="page-head">
      <div>
        <h1>SNS 콘텐츠 자동 생성</h1>
        <p>인스타 · 블로그 · 카드뉴스용 문구를 AI로 작성</p>
      </div>
      <button class="btn btn-primary" type="button" @click="generate">콘텐츠 생성</button>
    </div>

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
        <h3>생성 결과</h3>
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

const topic = ref('실손 보험료 인상, 어떻게 대비할까')
const channel = ref('인스타그램')
const tone = ref('전문적이지만 친절하게')
const output = ref('')

function generate() {
  output.value = `📌 ${topic.value}

실손 보험료가 매년 오르는 이유,
그리고 ‘갱신형 vs 전환’을 가르는 기준을 정리했어요.

✔ 지금 증권이 갱신형인지 확인
✔ 암·수술·간병 공백 체크
✔ 월 부담 가능한 리모델링안 비교

설계사가 증권만 보면 10분 안에 방향을 잡아드립니다.
DM으로 ‘증권점검’ 남겨주세요.

#보험설계사 #실손보험 #보장분석 #${channel.value.replace(/\s/g, '')}
(${tone.value})`
}
</script>
