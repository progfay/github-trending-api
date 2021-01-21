import type { HTMLElement } from 'node-html-parser'

export interface Trending {
  path: string
  description: string
}

export function extractTrending(document: HTMLElement): Trending[] {
  return document
    .querySelectorAll('article.Box-row')
    .map<Trending>(article => ({
      path: article.querySelector('h1')?.querySelector('a')?.getAttribute('href') ?? '',
      description: article.querySelector('p')?.text?.trim() ?? ''
    }))
    .filter(({ path }) => path !== '')
}
