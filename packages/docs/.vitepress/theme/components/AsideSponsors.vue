<script setup lang="ts">
import { computed } from 'vue'
import { VPDocAsideSponsors } from 'vitepress/theme'
import sponsors from './sponsors.json'

// to avoid the never[] type in json
interface Sponsor {
  alt: string
  href: string
  imgSrcDark: string
  imgSrcLight: string
}

const asideSponsors = computed(() => {
  return [
    {
      size: 'mini',
      items: sponsors.platinum.length ? sponsors.platinum.map((sponsor: Sponsor) => ({
        name: sponsor.alt,
        url: sponsor.href,
        img: sponsor.imgSrcLight,
      })) : [
        {
          name: 'Become a sponsor',
          url: 'https://github.com/sponsors/posva',
          img: '/your-logo-here.svg'
        }
      ],
    },
    {
      size: 'xmini',
      // TODO: use gold instead once I have some
      items: sponsors.silver.map((sponsor: Sponsor) => ({
        name: sponsor.alt,
        url: sponsor.href,
        img: sponsor.imgSrcLight,
      })),
    },
  ]
})
</script>

<template>
  <VPDocAsideSponsors :data="asideSponsors" />

  <!-- <a
    class="banner mp"
    href="https://masteringpinia.com?utm=pinia-sidebar"
    target="_blank"
  >
    <img width="22" height="22" src="/mp-pinia-logo.svg" />
    <span>
      <p class="extra-info">Complete guide to</p>
      <p class="heading">Mastering Pinia</p>
      <p class="extra-info">written by its creator</p>
    </span>
  </a> -->

  <a
    class="banner cert"
    href="https://certificates.dev/vuejs/?friend=VUEROUTER&utm_source=pinia_vuejs&utm_medium=link&utm_campaign=pinia_vuejs_links&utm_content=sidebar"
    target="_blank"
  >
    <img width="22" height="22" src="/vue-cert-logo.svg" />
    <span>
      <p class="extra-info">The official</p>
      <p class="heading">Vue.js Certification</p>
      <p class="extra-info">Get certified!</p>
    </span>
  </a>
</template>

<style scoped>
.VPDocAsideSponsors {
  margin-top: 8px !important;
}

:deep(.vp-sponsor-grid.mini .vp-sponsor-grid-image) {
  max-width: 158px;
  max-height: 48px;
}
:deep(.vp-sponsor-grid.xmini .vp-sponsor-grid-image) {
  max-width: 80px;
  max-height: 32px;
}

.banner {
  margin: 0.25rem 0;
  padding: 0.4rem 0;
  border-radius: 14px;
  position: relative;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 1rem;
  background-color: var(--vp-c-bg-alt);
  border: 2px solid var(--vp-c-bg-alt);
  transition: border-color 0.5s;
}

.banner:last-of-type {
  margin-bottom: 1rem;
}

.banner:hover {
  border: 2px solid var(--vp-c-brand-1);
}

.banner.cert:hover {
  border: 2px solid var(--vp-c-green-1);
}

.banner img {
  transition: transform 0.5s;
  transform: scale(1.25);
}
.banner:hover img {
  transform: scale(1.75);
}

.banner .extra-info {
  color: var(--vp-c-text-1);
  opacity: 0;
  font-size: 0.7rem;
  padding-left: 0.1rem;
  transition: opacity 0.5s;
}

.banner .heading {
  background-image: linear-gradient(
    120deg,
    var(--vp-c-brand-3) 16%,
    var(--vp-c-brand-2),
    var(--vp-c-brand-1)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.banner.cert .heading {
  background-image: linear-gradient(
    120deg,
    var(--vp-c-green-3) 16%,
    var(--vp-c-green-2),
    var(--vp-c-green-1)
  );
}

.banner:hover .extra-info {
  opacity: 0.9;
}
</style>
