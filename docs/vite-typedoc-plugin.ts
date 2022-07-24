import { Plugin } from 'vite'
import _fs from 'fs'
import { TypeDocOptions } from 'typedoc'
import { createTypeDocApp } from './typedoc-markdown'

export default function TypeDocPlugin(
  config: Partial<TypeDocOptions> = {}
): Plugin {
  const { serve, setTargetMode } = createTypeDocApp(config)
  setTargetMode('serve')

  return {
    name: 'typedoc',
    apply: 'serve',
    buildStart() {
      return serve()
    },
  }
}
