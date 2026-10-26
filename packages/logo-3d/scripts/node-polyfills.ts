import { crc32, deflateSync } from 'node:zlib'

/**
 * Just enough browser API for GLTFExporter to write a GLB with DataTextures
 * in Node: FileReader, ImageData and an OffscreenCanvas that encodes PNG.
 */

globalThis.FileReader ??= class {
  result: ArrayBuffer | string | null = null
  onloadend: (() => void) | null = null
  readAsArrayBuffer(blob: Blob) {
    blob.arrayBuffer().then((b) => {
      this.result = b
      this.onloadend?.()
    })
  }
  readAsDataURL(blob: Blob) {
    blob.arrayBuffer().then((b) => {
      this.result = `data:${blob.type};base64,${Buffer.from(b).toString('base64')}`
      this.onloadend?.()
    })
  }
} as unknown as typeof FileReader

globalThis.ImageData ??= class {
  data: Uint8ClampedArray
  width: number
  height: number
  constructor(data: Uint8ClampedArray, width: number, height: number) {
    this.data = data
    this.width = width
    this.height = height
  }
} as unknown as typeof ImageData

function chunk(type: string, data: Uint8Array): Buffer {
  const out = Buffer.alloc(12 + data.length)
  out.writeUInt32BE(data.length, 0)
  out.write(type, 4, 'ascii')
  out.set(data, 8)
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length)
  return out
}

export function encodePng(
  width: number,
  height: number,
  rgba: Uint8ClampedArray
): Buffer {
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    // "up" filter, the textures are mostly smooth vertical gradients
    raw[y * (stride + 1)] = 2
    for (let x = 0; x < stride; x++) {
      const v = rgba[y * stride + x]!
      const above = y ? rgba[(y - 1) * stride + x]! : 0
      raw[y * (stride + 1) + 1 + x] = (v - above) & 0xff
    }
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0)
  header.writeUInt32BE(height, 4)
  header.set([8, 6, 0, 0, 0], 8)
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', new Uint8Array()),
  ])
}

globalThis.OffscreenCanvas ??= class {
  width: number
  height: number
  private image: ImageData | null = null
  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }
  getContext() {
    const self = this
    type Source = {
      data?: Uint8ClampedArray | Uint8Array
      width: number
      height: number
      image?: ImageData | null
    }
    return {
      putImageData: (image: ImageData) => (this.image = image),
      fillStyle: '#000000',
      // whole canvas fills only, that is all GLTFExporter does
      fillRect(
        this: { fillStyle: string },
        _x: number,
        _y: number,
        w: number,
        h: number
      ) {
        const hex = Number.parseInt(this.fillStyle.slice(1), 16)
        const data = new Uint8ClampedArray(w * h * 4)
        for (let i = 0; i < data.length; i += 4)
          data.set([hex >> 16, (hex >> 8) & 255, hex & 255, 255], i)
        self.image = new ImageData(data, w, h)
      },
      getImageData: () =>
        new ImageData(
          new Uint8ClampedArray(this.image!.data),
          this.image!.width,
          this.image!.height
        ),
      translate() {},
      scale() {},
      // DataTexture images and other shim canvases only
      drawImage: (src: Source) => {
        const pixels = src.data ?? src.image?.data
        if (!pixels)
          throw new Error('Only DataTexture images can be exported in Node')
        this.image = new ImageData(
          new Uint8ClampedArray(pixels),
          src.width,
          src.height
        )
      },
    }
  }
  async convertToBlob({ type }: { type?: string } = {}) {
    if (type && type !== 'image/png')
      throw new Error(`Unsupported image type ${type}`)
    const img = this.image!
    return new Blob(
      [new Uint8Array(encodePng(img.width, img.height, img.data))],
      { type: 'image/png' }
    )
  }
} as unknown as typeof OffscreenCanvas
