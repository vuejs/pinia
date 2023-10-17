/*
 * FileSaver.js A saveAs() FileSaver implementation.
 *
 * Originally by Eli Grey, adapted as an ESM module by Eduardo San Martin
 * Morote.
 *
 * License : MIT
 */

import { IS_CLIENT } from '../env'

// The one and only way of getting global scope in all environments
// https://stackoverflow.com/q/3277182/1008999
const _global = /*#__PURE__*/ (() =>
  typeof window === 'object' && window.window === window
    ? window
    : typeof self === 'object' && self.self === self
    ? self
    : typeof global === 'object' && global.global === global
    ? global
    : typeof globalThis === 'object'
    ? globalThis
    : { HTMLElement: null })()

export interface Options {
  autoBom?: boolean
}

function bom(blob: Blob, { autoBom = false }: Options = {}) {
  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  if (
    autoBom &&
    /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(
      blob.type
    )
  ) {
    return new Blob([String.fromCharCode(0xfeff), blob], { type: blob.type })
  }
  return blob
}

function download(url: string, name: string, opts?: Options) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    saveAs(xhr.response, name, opts)
  }
  xhr.onerror = function () {
    console.error('could not download file')
  }
  xhr.send()
}

function corsEnabled(url: string) {
  const xhr = new XMLHttpRequest()
  // use sync to avoid popup blocker
  xhr.open('HEAD', url, false)
  try {
    xhr.send()
  } catch (e) {}
  return xhr.status >= 200 && xhr.status <= 299
}

// `a.click()` doesn't work for all browsers (#465)
function click(node: Element) {
  try {
    node.dispatchEvent(new MouseEvent('click'))
  } catch (e) {
    const evt = document.createEvent('MouseEvents')
    evt.initMouseEvent(
      'click',
      true,
      true,
      window,
      0,
      0,
      0,
      80,
      20,
      false,
      false,
      false,
      false,
      0,
      null
    )
    node.dispatchEvent(evt)
  }
}

const _navigator = typeof navigator === 'object' ? navigator : { userAgent: '' }

// Detect WebView inside a native macOS app by ruling out all browsers
// We just need to check for 'Safari' because all other browsers (besides Firefox) include that too
// https://www.whatismybrowser.com/guides/the-latest-user-agent/macos
const isMacOSWebView = /*#__PURE__*/ (() =>
  /Macintosh/.test(_navigator.userAgent) &&
  /AppleWebKit/.test(_navigator.userAgent) &&
  !/Safari/.test(_navigator.userAgent))()

export type SaveAs =
  | ((blob: Blob, name?: string, opts?: Options) => void)
  | ((
      blob: Blob,
      name: string,
      opts?: Options | undefined,
      popup?: Window | null | undefined
    ) => void)

export const saveAs: SaveAs = !IS_CLIENT
  ? () => {} // noop
  : // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
  typeof HTMLAnchorElement !== 'undefined' &&
    'download' in HTMLAnchorElement.prototype &&
    !isMacOSWebView
  ? downloadSaveAs
  : // Use msSaveOrOpenBlob as a second approach
  'msSaveOrOpenBlob' in _navigator
  ? msSaveAs
  : // Fallback to using FileReader and a popup
    fileSaverSaveAs

function downloadSaveAs(blob: Blob, name: string = 'download', opts?: Options) {
  const a = document.createElement('a')

  a.download = name
  a.rel = 'noopener' // tabnabbing

  // TODO: detect chrome extensions & packaged apps
  // a.target = '_blank'

  if (typeof blob === 'string') {
    // Support regular links
    a.href = blob
    if (a.origin !== location.origin) {
      if (corsEnabled(a.href)) {
        download(blob, name, opts)
      } else {
        a.target = '_blank'
        click(a)
      }
    } else {
      click(a)
    }
  } else {
    // Support blobs
    a.href = URL.createObjectURL(blob)
    setTimeout(function () {
      URL.revokeObjectURL(a.href)
    }, 4e4) // 40s
    setTimeout(function () {
      click(a)
    }, 0)
  }
}

function msSaveAs(blob: Blob, name: string = 'download', opts?: Options) {
  if (typeof blob === 'string') {
    if (corsEnabled(blob)) {
      download(blob, name, opts)
    } else {
      const a = document.createElement('a')
      a.href = blob
      a.target = '_blank'
      setTimeout(function () {
        click(a)
      })
    }
  } else {
    // @ts-ignore: works on windows
    navigator.msSaveOrOpenBlob(bom(blob, opts), name)
  }
}

function fileSaverSaveAs(
  blob: Blob,
  name: string,
  opts?: Options,
  popup?: Window | null
) {
  // Open a popup immediately do go around popup blocker
  // Mostly only available on user interaction and the fileReader is async so...
  popup = popup || open('', '_blank')
  if (popup) {
    popup.document.title = popup.document.body.innerText = 'downloading...'
  }

  if (typeof blob === 'string') return download(blob, name, opts)

  const force = blob.type === 'application/octet-stream'
  const isSafari =
    /constructor/i.test(String(_global.HTMLElement)) || 'safari' in _global
  const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent)

  if (
    (isChromeIOS || (force && isSafari) || isMacOSWebView) &&
    typeof FileReader !== 'undefined'
  ) {
    // Safari doesn't allow downloading of blob URLs
    const reader = new FileReader()
    reader.onloadend = function () {
      let url = reader.result
      if (typeof url !== 'string') {
        popup = null
        throw new Error('Wrong reader.result type')
      }
      url = isChromeIOS
        ? url
        : url.replace(/^data:[^;]*;/, 'data:attachment/file;')
      if (popup) {
        popup.location.href = url
      } else {
        location.assign(url)
      }
      popup = null // reverse-tabnabbing #460
    }
    reader.readAsDataURL(blob)
  } else {
    const url = URL.createObjectURL(blob)
    if (popup) popup.location.assign(url)
    else location.href = url
    popup = null // reverse-tabnabbing #460
    setTimeout(function () {
      URL.revokeObjectURL(url)
    }, 4e4) // 40s
  }
}
