<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()
const translations = {
  'en-US':
    'Master this and much more with the official video course by the author of Pinia',
  'zh-CN': '通过 Pinia 作者的官方视频课程掌握更多内容',
}
defineProps<{ href: string; title: string }>()
</script>

<template>
  <div class="mp">
    <a
      :href="href"
      target="_blank"
      rel="noopener"
      :title="title"
      class="no-icon"
    >
      <div class="text">
        <slot>{{ translations[site.lang] }}</slot>
      </div>
    </a>
  </div>
</template>

<style scoped>
.mp {
  margin-top: 20px;
  background-color: var(--vp-code-block-bg);
  padding: 1em 1.25em;
  border-radius: 2px;
  position: relative;
  border-radius: 1em;
  border: 2px solid var(--vp-c-bg-alt);
  transition: border-color 0.5s;
}
.mp:hover {
  border: 2px solid var(--vp-c-brand-1);
}

.mp a {
  color: var(--c-text);
  position: relative;
  display: flex;
  gap: 1em;
  grid-template-columns: 1fr auto;
  align-items: center;
  justify-content: space-between;
  padding-left: 36px;
}
.mp a .content {
  flex-grow: 1;
}
.mp a:before {
  content: '';
  position: absolute;
  display: block;
  width: 30px;
  height: 30px;
  top: calc(50% - 15px);
  left: -4px;
  border-radius: 50%;
  background-color: var(--vp-c-brand-1);
}
html.dark .mp a:after {
  --play-icon-color: #000;
}
.mp a:after {
  content: '';
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  top: calc(50% - 5px);
  left: 8px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 9px solid var(--play-icon-color, #fff);
}
</style>
