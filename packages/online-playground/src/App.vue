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

const store = new ReplStore({
  serializedState: hash,
  defaultVueRuntimeURL:
    'https://cdn.jsdelivr.net/npm/@vue/runtime-dom@3.3.4/+esm',
  defaultVueServerRendererURL:
    'https://cdn.jsdelivr.net/npm/@vue/server-renderer@3.3.4/+esm',
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

if (!hash) {
  store.setImportMap({
    imports: {
      ...store.getImportMap().imports,
      pinia: import.meta.env.PROD
        ? `${location.origin}/pinia.esm-browser.js`
        : `${location.origin}/src/pinia-dev-proxy`,
      ...(import.meta.env.PROD
        ? {
            '@vue/devtools-api':
              'https://cdn.jsdelivr.net/npm/@vue/devtools-api@6.5.1/lib/esm/index.js',
            'vue-demi': 'https://cdn.jsdelivr.net/npm/vue-demi@0.14.6/+esm',
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
