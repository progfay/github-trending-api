import https from 'https'
import { URL } from 'url'

import type { Language, DateRange, SpokenLanguageCode } from './types'

async function fetch(url: URL): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    let text = ''
    https.get(url, res => {
      res.setEncoding('utf-8')
      res.on('data', chunk => {
        text += chunk.toString() as string
      })
      res.on('end', () => resolve(text))
      res.on('error', reject)
    })
  })
}

export interface TrendingOption {
  language?: Language
  since?: DateRange
  spokenLanguageCode?: SpokenLanguageCode
}

export async function fetchTrendingHtml(opts?: TrendingOption): Promise<string> {
  const url = new URL(`https://github.com/trending/${encodeURIComponent(opts?.language ?? '')}`)
  url.searchParams.set('since', opts?.since ?? '')
  url.searchParams.set('spoken_language_code', opts?.spokenLanguageCode ?? '')
  return await fetch(url)
}
