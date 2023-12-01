<script setup lang="ts">
import Header from './Header.vue'
import { Repl, ReplStore, SFCOptions, ReplProps } from '@vue/repl'
import Monaco from '@vue/repl/monaco-editor'
import { ref, watchEffect, onMounted, provide } from 'vue'
import { AppVue, PiniaVersionKey, counterTs } from './defaults'

const setVH = () => {
  document.documentElement.style.setProperty('--vh', window.innerHeight + `px`)
}
window.addEventListener('resize', setVH)
setVH()

const useDevMode = ref(false)

let hash = location.hash.slice(1)
if (hash.startsWith('__DEV__')) {
  hash = hash.slice(7)
  useDevMode.value = true
}

// TODO: we should fetch the latest version and set it by default here
const store = new ReplStore({
  serializedState: hash,
  defaultVueRuntimeURL:
    'https://cdn.jsdelivr.net/npm/@vue/runtime-dom@3.3.9/dist/runtime-dom.esm-browser.js',
  defaultVueServerRendererURL:
    'https://cdn.jsdelivr.net/npm/@vue/server-renderer@3.3.9/dist/server-renderer.esm-browser.js',
})

const previewOptions: ReplProps['previewOptions'] = {
  customCode: {
    importCode: `import { createPinia } from 'pinia'`,
    useCode: `app.use(createPinia())`,
  },
}

// enable experimental features
const sfcOptions: SFCOptions = {
  script: {
    inlineTemplate: !useDevMode.value,
    isProd: !useDevMode.value,
    reactivityTransform: true,
    defineModel: true,
  },
  style: {
    isProd: !useDevMode.value,
  },
  template: {
    isProd: !useDevMode.value,
  },
}

const piniaVersion = ref(`latest`)
provide(PiniaVersionKey, piniaVersion)

// FIXME: cannot get autocompletion and auto import to work like it does for Vue
// watchEffect(() => {
//   store.state.dependencyVersion ??= {}
//   store.state.dependencyVersion.pinia ??=
//     piniaVersion.value === 'latest' ? '^2.1.0' : piniaVersion.value
// })

// FIXME: use a CDN that can fix the sub deps: https://play.pinia.vuejs.org/#eNp9VMFy2jAQ/RWNL8AEJJikOTCQuu3kkB7aTtOjL8ZeQMReaaQ1YYbxv3ctg0MI5GR79+3bt09a76Nv1sptBdE0mvnMaUvCA1VWFCmu5klEPokeEtSlNY7EXlQensk4ELVYOlOKnlSZqZDASfK9BBPMDHomCaB5h+8PEpyptgPz8QdBaYuUgL+EmC0qIoMizgqdvXDfUC/x5obbP2HmoATk/vuWWKKo65lqi5hgpjq2aBi1YkdlauXGG+TR9k2P5JDgiaYiRJqY1ajTJpJEKrxL8OVo4cyr55k2DB4eoTH7pHLYkjGFH6VWt2VrIuunSnGd9Gv1ARXfyy9yogq9aCBKYw67j8RsFDvp4CrnERBPxsw3/pqD9XOOj3IodTyWkzt5f8J5zFzkOyvruOJbeSvv3rNcI7iEVezZFtzIAQ/pwF036Ax4JGu46gRrPkXyfJOWenV2hpkprS7A/bak+aa9O8u0KMzrzxAjV0GnLFtD9nIhvvG7VuEfB0HQyTSUuhVQm358/gU7fu+Spcmr4uDMleRf8KaoGo0t7HuFOcs+wQW1T+FKalz98487AvTHoRqhwY2AD+7++GT0N7ns5ImLb8vJFnZbnMNS49kih8vPG9yBHCy7JHcPyw27kGx3vPsXzE8J+72wor1hK84Tb+VU9Adi/iD6B704FeMwVz3gRz2I6v/N038l

if (!hash) {
  store.setImportMap({
    imports: {
      ...store.getImportMap().imports,
      pinia: import.meta.env.PROD
        ? `/pinia.esm-browser.js`
        : `/src/pinia-dev-proxy`,
      ...(import.meta.env.PROD
        ? {
            '@vue/devtools-api':
              'https://cdn.jsdelivr.net/npm/@vue/devtools-api@6.5.1/lib/esm/index.js',
            'vue-demi':
              'https://cdn.jsdelivr.net/npm/vue-demi@0.14.6/lib/v3/index.mjs',
          }
        : {}),
    },
  })

  store.setFiles({
    // gets the tsconfig and import map
    ...store.getFiles(),
    'App.vue': AppVue,
    'counter.ts': counterTs,
  })
}

// persist state
watchEffect(() => {
  const newHash = store
    .serialize()
    .replace(/^#/, useDevMode.value ? `#__DEV__` : `#`)
  history.replaceState({}, '', newHash)
})

function toggleDevMode() {
  const dev = (useDevMode.value = !useDevMode.value)
  sfcOptions.script!.inlineTemplate =
    sfcOptions.script!.isProd =
    sfcOptions.template!.isProd =
    sfcOptions.style!.isProd =
      !dev
  store.setFiles(store.getFiles())
}

const theme = ref<'dark' | 'light'>('dark')
function toggleTheme(isDark: boolean) {
  theme.value = isDark ? 'dark' : 'light'
}

onMounted(() => {
  const cls = document.documentElement.classList
  toggleTheme(cls.contains('dark'))
})
</script>

<template>
  <Header
    :store="store"
    :dev="useDevMode"
    @toggle-theme="toggleTheme"
    @toggle-dev="toggleDevMode"
  />
  <Repl
    :theme="theme"
    :editor="Monaco"
    @keydown.ctrl.s.prevent
    @keydown.meta.s.prevent
    :store="store"
    :showCompileOutput="true"
    :autoResize="true"
    :sfcOptions="sfcOptions"
    :clearConsole="false"
    :previewOptions="previewOptions"
  />
</template>

<style>
:root {
  --c-branding: #987a00;
  --c-branding-dark: #5ad26c;

  --color-branding: var(--c-branding);
  --color-branding-dark: var(--c-branding-dark);
}

.dark {
  --c-branding: #ffe166;

  --color-branding: var(--c-branding);
  --color-branding-dark: var(--c-branding-dark);
}

.dark {
  color-scheme: dark;
}

body {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  --base: #444;
  --nav-height: 50px;
}

.vue-repl {
  height: calc(var(--vh) - var(--nav-height)) !important;
}

button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>

<style scoped>
.vue-repl :deep(.split-pane) {
  --color-branding: var(--c-branding);
  --color-branding-dark: var(--c-branding-dark);
}
</style>
