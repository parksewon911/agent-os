<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">{{ brand.name }}</div>
        <div class="brand-sub">{{ brand.tagline }}</div>
      </div>
      <nav class="nav">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">
          <span aria-hidden="true">{{ iconMap[item.icon] }}</span>
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { brand, navItems } from './config/brand.js'

const iconMap = {
  grid: '▦',
  users: '◎',
  bot: '◈',
  scan: '▣',
  shield: '◇',
  doc: '▤',
  chart: '▥',
  scale: '⚖',
  share: '↗',
  recruit: '☆',
  team: '☰',
}
</script>
