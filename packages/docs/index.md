---
home: true
heroImage: /logo.svg
actionText: 시작하기
actionLink: /introduction.html

altActionText: Demo 데모
altActionLink: https://stackblitz.com/github/piniajs/example-vue-3-vite

features:
  - title: 💡 직관적인
    details: Store는 컴포넌트와 친숙합니다. 잘 정리된 상점을 작성할 수 있도록 설계된 API입니다.
  - title: 🔑 타입에 안정적인
    details: 타입이 자동으로 유추됩니다, 이것은 Store가 자바스크립트에서도 자동 완성 기능을 제공한다는 것을 의미합니다!
  - title: ⚙️ Devtools 지원
    details: Vue2이든 Vue3이든 관계없이 Vue devtools와 함께 사용하는 Pinia는 더 나은 개발 경험을 제공할 수 있습니다.
  - title: 🔌 확장성
    details: 트랜잭션, 로컬 스토리지 동기화 등으로 Pinia를 확장하기 위해 변경 사항을 저장하기 위해 반응합니다.
  - title: 🏗 모듈식 디자인
    details: 여러 상점을 만들고 번들러가 자동으로 상점을 분할할 수 있도록 합니다.
  - title: 📦 굉장히 가벼운
    details: Pinia는 크기가 약 1kb에 불과하므로 존재를 잊어버릴 수도 있습니다!
footer: MIT Licensed | Copyright © 2019-present Eduardo San Martin Morote
---

<ThemeToggle/>
<!-- <TestStore/> -->

<HomeSponsors />

<script setup>
import HomeSponsors from './.vitepress/components/HomeSponsors.vue'
import ThemeToggle from './.vitepress/components/ThemeToggle.vue'
// import TestStore from './.vitepress/components/TestStore.vue'
</script>
