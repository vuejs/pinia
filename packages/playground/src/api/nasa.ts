import { mande } from 'mande'

/**
 * Go to https://api.nasa.gov/ and generate a key. Put it in your `.env` file
 * next to the `package.json` file:
 *
 * VITE_API_KEY_NASA=<your_key>
 */
const API_KEY = import.meta.env.VITE_API_KEY_NASA || 'DEMO_KEY'

const nasaPlanetary = mande('https://api.nasa.gov/planetary', {
  query: { api_key: API_KEY, thumbs: true },
})

export interface NASAPOD {
  copyright: string
  date: string
  explanation: string
  hdurl: string
  media_type: 'image' | 'video'
  title: string
  url: string
}

export function getNASAPOD(date: Date | string = new Date()) {
  if (typeof date !== 'string') {
    date = date.toISOString().slice(0, 10)
  }

  return nasaPlanetary.get<NASAPOD>('/apod', { query: { date } })
}
