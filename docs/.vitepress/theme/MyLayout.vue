<script setup>
import { watch, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { Layout } = DefaultTheme
const { page } = useData()

watch(page, changeLinkText, { immediate: true })

// outline-link 텍스트 수정
async function changeLinkText() {
  /*
   * vitepress config.markdown.attrs에서 커스텀 옵션을 사용함에 따라
   * 아울라인 링크 텍스트가 정상적으로 텍스트를 파싱하지 못함.
   * 별다른 방법이 없으므로, 해당 이슈가 수정되기 전까지 임시 조치 함수를 사용.
   */
  if (!page.value.headers.length) { return }
  if (typeof window === 'undefined') { return }
  await nextTick()
  const outlineLinks = document.querySelectorAll('.outline-link')
  outlineLinks.forEach(el => el.innerText = el.innerText.replace(/\s%\{#.+}%$/, ''))
}

</script>

<template>
  <Layout/>
</template>