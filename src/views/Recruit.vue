<template>
  <section>
    <div class="page-head">
      <div>
        <h1>리크루팅 현황</h1>
        <p>지원자 파이프라인 · 면접 · 적합도 점수 관리</p>
      </div>
      <button class="btn btn-primary" type="button">지원자 등록</button>
    </div>

    <article class="card">
      <table class="table">
        <thead>
          <tr>
            <th>이름</th>
            <th>유입</th>
            <th>경력</th>
            <th>상태</th>
            <th>적합도</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in applicants" :key="a.id">
            <td><strong>{{ a.name }}</strong></td>
            <td>{{ a.channel }}</td>
            <td>{{ a.experience }}</td>
            <td><span class="tag">{{ a.status }}</span></td>
            <td>
              <div class="score-ring" :style="{ '--p': a.score }">
                <span>{{ a.score }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </article>

    <div class="grid grid-3" style="margin-top: 16px">
      <article class="card">
        <h3>이번 달 지원</h3>
        <div class="stat-value">12</div>
      </article>
      <article class="card">
        <h3>면접 예정</h3>
        <div class="stat-value">4</div>
      </article>
      <article class="card">
        <h3>합격·온보딩</h3>
        <div class="stat-value">2</div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { applicants } from '../data/mock.js'
</script>
