#!/usr/bin/env node

const https = require('https')
const { parse } = require('node-html-parser')

async function fetch(url) {
  return await new Promise((resolve, reject) => {
    let text = ''
    https.get(url, res => {
      res.setEncoding('utf-8')
      res.on('data', chunk => {
        text += chunk.toString()
      })
      res.on('end', () => resolve(text))
      res.on('error', reject)
    })
  })
}

async function main() {
  const html = await fetch('https://github.com/trending')
  const document = parse(html)
  const spokenLanguageCodes = document
    .querySelector('#select-menu-spoken-language')
    .querySelectorAll('a.select-menu-item')
    .map(item => new URL(item.getAttribute('href'), 'https://github.com'))
    .map(url => url.searchParams.get('spoken_language_code'))
    .map(code => JSON.stringify(code))

  const languages = document
    .querySelector('#select-menu-language')
    .querySelectorAll('a.select-menu-item')
    .map(item => new URL(item.getAttribute('href'), 'https://github.com'))
    .map(url => url.pathname.replace(/^\/trending\//, ''))
    .map(code => JSON.stringify(code))

  const dateRanges = document
    .querySelector('#select-menu-date')
    .querySelectorAll('a.select-menu-item')
    .map(item => new URL(item.getAttribute('href'), 'https://github.com'))
    .map(url => url.searchParams.get('since'))
    .map(code => JSON.stringify(code))

  console.log(`export type SpokenLanguageCode = ${spokenLanguageCodes.join(' | ')} | ""\n`)
  console.log(`export type Language = ${languages.join(' | ')} | ""\n`)
  console.log(`export type DateRange = ${dateRanges.join(' | ')} | ""\n`)
}

main()
