import https from 'https'
import { EventEmitter } from 'events'
import { fetchTrendingHtml } from '../fetch-trending-html'

function createHttpsGetMock(): jest.MockInstance<
  ReturnType<typeof https['get']>,
  Parameters<typeof https['get']>
> {
  return jest.fn().mockImplementation((_, callback?) => {
    const emitter = new EventEmitter()
    const httpIncomingMessage = {
      on: (event: string, listener: (...args: any[]) => void) => {
        emitter.on(event, listener)
      },
      setEncoding: jest.fn()
    }
    callback?.(httpIncomingMessage)
    emitter.emit('data', 'html')
    emitter.emit('end')
    return emitter
  })
}

describe('fetchTrendingHtml(opts)', () => {
  it('request with no options', async done => {
    const httpsGetMock = createHttpsGetMock()
    // @ts-expect-error
    https.get = httpsGetMock
    const html = await fetchTrendingHtml()
    expect(html).toBe('html')
    const arg = httpsGetMock.mock.calls[0]?.[0] ?? ''
    const url = typeof arg === 'string' ? new URL(arg) : arg
    expect(url.protocol).toBe('https:')
    expect(url.hostname).toBe('github.com')
    expect(url.pathname.replace(/\/$/, '')).toBe('/trending')
    expect(url.searchParams.get('since')).toBe('')
    expect(url.searchParams.get('spoken_language_code')).toBe('')
    done()
  })

  it('request with options', async done => {
    const httpsGetMock = createHttpsGetMock()
    // @ts-expect-error
    https.get = httpsGetMock
    const html = await fetchTrendingHtml({
      language: 'typescript',
      since: 'daily',
      spokenLanguageCode: 'en'
    })
    expect(html).toBe('html')
    const arg = httpsGetMock.mock.calls[0]?.[0] ?? ''
    const url = typeof arg === 'string' ? new URL(arg) : arg
    expect(url.protocol).toBe('https:')
    expect(url.hostname).toBe('github.com')
    expect(url.pathname.replace(/\/$/, '')).toBe('/trending/typescript')
    expect(url.searchParams.get('since')).toBe('daily')
    expect(url.searchParams.get('spoken_language_code')).toBe('en')
    done()
  })
})
