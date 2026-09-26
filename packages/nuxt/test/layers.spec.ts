import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { loadNuxt } from '@nuxt/kit'
import type { ModuleOptions } from '../src/module'
import piniaModule from '../src/module'

const fixtureDir = fileURLToPath(
  new URL('./fixtures/layers-default', import.meta.url)
)

/**
 * Loads the layered fixture with the pinia module and collects the directories
 * added through `addImportsDir()` by calling the hook they are queued on.
 */
async function getAutoImportedDirs(pinia?: ModuleOptions) {
  const nuxt = await loadNuxt({
    cwd: fixtureDir,
    ready: true,
    overrides: {
      modules: [piniaModule],
      ...(pinia ? { pinia } : {}),
    },
  })

  try {
    const dirs: string[] = []
    await nuxt.callHook('imports:dirs', dirs)
    return dirs
  } finally {
    await nuxt.close()
  }
}

describe('storesDirs', () => {
  it('scans layers with the default value', async () => {
    const dirs = await getAutoImportedDirs()

    expect(dirs).toContain(resolve(fixtureDir, 'layers/test/app/stores'))
    expect(dirs).toContain(resolve(fixtureDir, 'app/stores'))
  })

  it('scans layers when explicitly set', async () => {
    const dirs = await getAutoImportedDirs({ storesDirs: ['stores'] })

    expect(dirs).toContain(resolve(fixtureDir, 'layers/test/app/stores'))
    expect(dirs).toContain(resolve(fixtureDir, 'app/stores'))
  })
})
