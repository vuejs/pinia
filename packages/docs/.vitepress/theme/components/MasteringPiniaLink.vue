<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, ref } from 'vue'

// TODO: split into 2 components

const { site } = useData()
const translations = {
  videoLink: {
    'en-US':
      'Master this and much more with the official video course by the author of Pinia',
    'zh-CN': '通过 Pinia 作者的官方视频课程掌握更多内容',
  },
  videoEmbed: {
    'en-US': 'Master this and much more with a free video from Mastering Pinia',
    'zh-CN': '通过 Mastering Pinia 的免费视频掌握更多内容',
  },
  watchMoreA: {
    'en-US': 'Watch more on ',
    'zh-CN': '在 ',
  },
  watchMoreB: {
    'en-US': '',
    'zh-CN': ' 上观看更多内容',
  },
}
const props = defineProps<{ href: string; title: string, mpLink?: string }>()
const isVideo = computed(() => props.href.startsWith('https://play.gumlet.io/'))
const isVideoOpen = ref(false)
</script>

<template>
  <div class="mp">
    <template v-if="isVideo">
      <div class="video-embed" v-if="isVideoOpen">
        <div style="padding: 56.25% 0 0 0; position: relative">
          <iframe
            loading="lazy"
            title="Gumlet video player"
            false
            :src="href + '?preload=false&autoplay=true&loop=false&disable_player_controls=false'"
            style="
              border: none;
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              width: 100%;
            "
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"
            frameborder="0"
            allowfullscreen
          >
          </iframe>
        </div>

        <div class="watch-more">
          {{ translations.watchMoreA[site.lang] }}
          <a :href="mpLink || 'https://masteringpinia.com'" target="_blank" rel="noopener">
            Mastering Pinia
            <img src="/mp-pinia-logo.svg" alt="mastering pinia logo" />
          </a>
          {{ translations.watchMoreB[site.lang] }}
        </div>
      </div>

      <button class="cta" :title v-else @click="isVideoOpen = true">
        <div class="text">
          <slot>{{ translations.videoEmbed[site.lang] }}</slot>
        </div>
      </button>
    </template>
    <a
      v-else
      :href="href"
      target="_blank"
      rel="noopener"
      :title="title"
      class="no-icon cta"
    >
      <div class="text">
        <slot>{{ translations.videoLink[site.lang] }}</slot>
      </div>
    </a>
  </div>
</template>

<style scoped>
.mp {
  margin-top: 20px;
}
.mp:has(.cta) {
  position: relative;
  transition: border-color 0.5s;
  padding: 1em 1.25em;
  background-color: var(--vp-code-block-bg);
  border-radius: 1em;
  border: 2px solid var(--vp-c-bg-alt);
}
.mp:has(.cta):hover {
  border: 2px solid var(--vp-c-brand-1);
}
.cta:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.watch-more {
  text-align: end;
  font-size: 0.8em;
  background-color: var(--vp-code-block-bg);
  border-radius: 0 0 1em 1em;
  padding-right: 1em;
}

.watch-more img {
  height: 1em;
  display: inline-block;
  /* vertical-align: middle; */
}

.cta {
  font-size: inherit;
  color: var(--c-text);
  position: relative;
  display: flex;
  gap: 1em;
  grid-template-columns: 1fr auto;
  align-items: center;
  justify-content: space-between;
  padding-left: 36px;
}
.cta .content {
  flex-grow: 1;
}
.cta:before {
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
html.dark .cta:after {
  --play-icon-color: #000;
}
.cta:after {
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
