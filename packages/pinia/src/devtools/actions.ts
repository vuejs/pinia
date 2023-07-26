import { Pinia } from '../rootStore'
import { saveAs } from './file-saver'
import { toastMessage } from './utils'

/**
 * This file contain devtools actions, they are not Pinia actions.
 */

// ---

export function checkClipboardAccess() {
  if (!('clipboard' in navigator)) {
    toastMessage(`Your browser doesn't support the Clipboard API`, 'error')
    return true
  }
}

function checkNotFocusedError(error: unknown): error is Error {
  if (
    error instanceof Error &&
    error.message.toLowerCase().includes('document is not focused')
  ) {
    toastMessage(
      'You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.',
      'warn'
    )
    return true
  }
  return false
}

export async function actionGlobalCopyState(pinia: Pinia) {
  if (checkClipboardAccess()) return
  try {
    await navigator.clipboard.writeText(JSON.stringify(pinia.state.value))
    toastMessage('Global state copied to clipboard.')
  } catch (error) {
    if (checkNotFocusedError(error)) return
    toastMessage(
      `Failed to serialize the state. Check the console for more details.`,
      'error'
    )
    console.error(error)
  }
}

export async function actionGlobalPasteState(pinia: Pinia) {
  if (checkClipboardAccess()) return
  try {
    loadStoresState(pinia, JSON.parse(await navigator.clipboard.readText()))
    toastMessage('Global state pasted from clipboard.')
  } catch (error) {
    if (checkNotFocusedError(error)) return
    toastMessage(
      `Failed to deserialize the state from clipboard. Check the console for more details.`,
      'error'
    )
    console.error(error)
  }
}

export async function actionGlobalSaveState(pinia: Pinia) {
  try {
    saveAs(
      new Blob([JSON.stringify(pinia.state.value)], {
        type: 'text/plain;charset=utf-8',
      }),
      'pinia-state.json'
    )
  } catch (error) {
    toastMessage(
      `Failed to export the state as JSON. Check the console for more details.`,
      'error'
    )
    console.error(error)
  }
}

let fileInput: HTMLInputElement | undefined
function getFileOpener() {
  if (!fileInput) {
    fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.json'
  }

  function openFile(): Promise<null | { text: string; file: File }> {
    return new Promise((resolve, reject) => {
      fileInput!.onchange = async () => {
        const files = fileInput!.files
        if (!files) return resolve(null)
        const file = files.item(0)
        if (!file) return resolve(null)
        return resolve({ text: await file.text(), file })
      }
      // @ts-ignore: TODO: changed from 4.3 to 4.4
      fileInput!.oncancel = () => resolve(null)
      fileInput!.onerror = reject
      fileInput!.click()
    })
  }
  return openFile
}

export async function actionGlobalOpenStateFile(pinia: Pinia) {
  try {
    const open = getFileOpener()
    const result = await open()
    if (!result) return
    const { text, file } = result
    loadStoresState(pinia, JSON.parse(text))
    toastMessage(`Global state imported from "${file.name}".`)
  } catch (error) {
    toastMessage(
      `Failed to import the state from JSON. Check the console for more details.`,
      'error'
    )
    console.error(error)
  }
}

function loadStoresState(pinia: Pinia, state: Record<string, unknown>) {
  for (const key in state) {
    const storeState = pinia.state.value[key]
    if (storeState) {
      Object.assign(storeState, state[key])
    }
  }
}
