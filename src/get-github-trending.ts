import { fetchTrendingHtml, TrendingOption } from './fetch-trending-html'
import { Options, parse } from 'node-html-parser'
import { extractTrending, Trending } from './extract-trending'

const htmlParseOptions: Partial<Options> = {
  lowerCaseTagName: false,
  comment: false,
  blockTextElements: {
    script: true,
    head: true,
    header: true,
    ul: true,
    details: true
  }
}

export async function getGitHubTrending(opts: TrendingOption): Promise<Trending[]> {
  return await fetchTrendingHtml(opts)
    .then(html => parse(html, htmlParseOptions))
    .then(document => extractTrending(document))
}
