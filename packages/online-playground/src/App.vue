<script setup lang="ts">
import Header from './Header.vue'
import {
  Repl,
  File,
  type SFCOptions,
  type ReplProps,
  useStore,
  useVueImportMap,
} from '@vue/repl'
import Monaco from '@vue/repl/monaco-editor'
import { ref, watchEffect, onMounted, computed } from 'vue'
import { AppVue, counterTs } from './defaults'
import piniaPkg from 'pinia/package.json'

const LOCAL_PINIA_VERSION = piniaPkg.version
const NOSTICS_VERSION = piniaPkg.dependencies.nostics.replace(/^\D*/, '')
const DEVTOOLS_API_VERSION = piniaPkg.peerDependencies[
  '@vue/devtools-api'
].replace(/^\D*/, '')

const replRef = ref<InstanceType<typeof Repl>>()

const setVH = () => {
  document.documentElement.style.setProperty('--vh', window.innerHeight + `px`)
}
window.addEventListener('resize', setVH)
setVH()

const AUTO_SAVE_STORAGE_KEY = 'pinia-playground-auto-save'
const initAutoSave: boolean = JSON.parse(
  localStorage.getItem(AUTO_SAVE_STORAGE_KEY) ?? 'true'
)
const autoSave = ref(initAutoSave)

const {
  productionMode,
  vueVersion,
  importMap: vueImportMap,
} = useVueImportMap(
  // in dev, serve vue from the vite dev server so the pinia dev proxy and the
  // user code share the same copy of vue
  import.meta.env.PROD
    ? {}
    : {
        runtimeDev: `${location.origin}/src/vue-dev-proxy`,
        runtimeProd: `${location.origin}/src/vue-dev-proxy`,
        serverRenderer: `${location.origin}/src/vue-server-renderer-dev-proxy`,
      }
)

// null = the local copy of pinia built from this repo
const piniaVersion = ref<string | null>(null)

const builtinImportMap = computed(() => ({
  ...vueImportMap.value,
  imports: {
    ...vueImportMap.value.imports,
    pinia: piniaVersion.value
      ? `https://cdn.jsdelivr.net/npm/pinia@${piniaVersion.value}/dist/pinia.esm-browser${productionMode.value ? '.prod' : ''}.js`
      : import.meta.env.PROD
        ? `${location.origin}/pinia.esm-browser${productionMode.value ? '.prod' : ''}.js`
        : `${location.origin}/src/pinia-dev-proxy`,
    // externals of the pinia dev esm-browser build
    nostics: `https://esm.sh/nostics@${NOSTICS_VERSION}`,
    '@vue/devtools-api': `https://esm.sh/@vue/devtools-api@${DEVTOOLS_API_VERSION}`,
  },
}))

// used by the language tools to fetch the types of pinia
const dependencyVersion = ref<Record<string, string>>({})
watchEffect(() => {
  dependencyVersion.value = {
    pinia: piniaVersion.value ?? LOCAL_PINIA_VERSION,
  }
})

let hash = location.hash.slice(1)
if (hash.startsWith('__DEV__')) {
  hash = hash.slice(7)
  productionMode.value = false
}
if (hash.startsWith('__PROD__')) {
  hash = hash.slice(8)
  productionMode.value = true
}

// enable experimental features
const sfcOptions = computed(
  (): SFCOptions => ({
    script: {
      inlineTemplate: productionMode.value,
      isProd: productionMode.value,
      propsDestructure: true,
    },
    style: {
      isProd: productionMode.value,
    },
    template: {
      isProd: productionMode.value,
    },
  })
)

const store = useStore(
  {
    vueVersion,
    template: ref({ welcomeSFC: AppVue }),
    builtinImportMap,
    sfcOptions,
    dependencyVersion,
  },
  hash
)
// @ts-expect-error only for debugging
globalThis.store = store

if (!hash) {
  store.addFile(new File('src/counter.ts', counterTs))
  store.setActive(store.mainFile)
} else {
  // links created by older versions of the playground pin pinia and its
  // former dependencies in their import map, shadowing the builtin one and
  // breaking in dev where only the dev proxy is served
  const importMap = store.getImportMap()
  const imports = importMap.imports ?? {}
  if (
    /\/(pinia\.esm-browser(\.prod)?\.js|src\/pinia-dev-proxy)$/.test(
      imports.pinia ?? ''
    )
  ) {
    delete imports.pinia
  }
  if (/@vue\/devtools-api@[67]/.test(imports['@vue/devtools-api'] ?? '')) {
    delete imports['@vue/devtools-api']
  }
  delete imports['vue-demi']
  store.setImportMap({
    ...importMap,
    imports: { ...builtinImportMap.value.imports, ...imports },
  })
}

const previewOptions: ReplProps['previewOptions'] = {
  customCode: {
    importCode: `import { createPinia } from 'pinia'`,
    useCode: `app.use(createPinia())`,
  },
}

// persist state
watchEffect(() => {
  const newHash = store
    .serialize()
    .replace(/^#/, productionMode.value ? `#__PROD__` : `#`)
  history.replaceState({}, '', newHash)
})

function toggleProdMode() {
  productionMode.value = !productionMode.value
}

function toggleAutoSave() {
  autoSave.value = !autoSave.value
  localStorage.setItem(AUTO_SAVE_STORAGE_KEY, String(autoSave.value))
}

function reloadPage() {
  replRef.value?.reload()
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
    :prod="productionMode"
    :autoSave="autoSave"
    :theme="theme"
    v-model:pinia-version="piniaVersion"
    @toggle-theme="toggleTheme"
    @toggle-prod="toggleProdMode"
    @toggle-autosave="toggleAutoSave"
    @reload-page="reloadPage"
  />
  <Repl
    ref="replRef"
    :theme="theme"
    :editor="Monaco"
    @keydown.ctrl.s.prevent
    @keydown.meta.s.prevent
    :model-value="autoSave"
    :editorOptions="{ autoSaveText: false }"
    :store="store"
    :showCompileOutput="true"
    :showOpenSourceMap="true"
    :autoResize="true"
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
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
