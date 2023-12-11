<template>
  <a
    class="mp-banner"
    href="https://masteringpinia.com?utm=pinia-sidebar"
    target="_blank"
  >
    <img width="22" height="22" src="/mp-pinia-logo.svg" />
    <span>
      <p class="extra-info">Complete guide to</p>
      <p class="heading">Mastering Pinia</p>
      <p class="extra-info">written by its author</p>
    </span>
  </a>

  <a
    class="banner"
    href="https://certificates.dev/vuejs?friend=VUEROUTER"
    target="_blank"
  >
    <img src="/banners/vuejs-certification.svg" alt="Vue.js Certification" />
  </a>
</template>

<style scoped>
.banner {
  margin-bottom: 0.5rem;
}

.mp-banner {
  margin: 1rem 0;
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

.mp-banner:hover {
  border: 2px solid var(--vp-c-brand-1);
}

.mp-banner img {
  transition: transform 0.5s;
  transform: scale(1.25);
}
.mp-banner:hover img {
  transform: scale(1.75);
}

.mp-banner .extra-info {
  color: var(--vp-c-text-1);
  opacity: 0;
  font-size: 0.7rem;
  padding-left: 0.1rem;
  transition: opacity 0.5s;
}

.mp-banner .heading {
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

.mp-banner:hover .extra-info {
  opacity: 0.9;
}
</style>
