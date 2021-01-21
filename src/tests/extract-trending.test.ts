import fs from 'fs'
import { parse } from 'node-html-parser'
import { extractTrending } from '../extract-trending'

describe('extractTrending(document)', () => {
  it('snapshot with actual html source', () => {
    const html = fs.readFileSync('./data/trending.html')
    const document = parse(html.toString('utf-8'), {
      lowerCaseTagName: false,
      comment: false,
      blockTextElements: {
        script: true,
        head: true,
        header: true,
        ul: true,
        details: true
      }
    })
    const actual = extractTrending(document)
    expect(actual).toMatchSnapshot()
  })
})
