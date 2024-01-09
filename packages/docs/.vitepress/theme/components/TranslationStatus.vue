<script lang="ts">
const originalLang = 'root'
const i18nLabels: {
  [lang: string]: string
} = {
  en: 'The translation is synced to the docs on ${date} of which the commit hash is <code>${hash}</code>.',
  zh: '该翻译已同步到了 ${date} 的版本，其对应的 commit hash 是 <code>${hash}</code>。',
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import status from '../../translation-status.json'

const { site } = useData()
const label = computed<string>(() => {
  const localeIndex = site.value.localeIndex
  if (!localeIndex || localeIndex === originalLang || !status[localeIndex]) {
    return ''
  }
  const { date, hash } = status[localeIndex]
  return (i18nLabels[localeIndex] || i18nLabels.en)
    .replace('${date}', `<time>${date}</time>`)
    .replace('${hash}', `<code>${hash.substring(0, 7)}</code>`)
})
</script>

<template>
  <div v-if="label" class="text-status" v-html="label"></div>
</template>

<style scoped>
.text-status {
  padding: 1em 1.25em;
  font-size: small;
  text-align: right;
  color: var(--vp-c-text-2);
}
</style>
