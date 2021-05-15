import * as cheerio from 'cheerio'
import { Metascores } from './types'
import scrape from './utils/scrape'

const urls = [
  'http://www.metacritic.com/browse/movies/release-date/theaters/metascore',
  'http://www.metacritic.com/browse/movies/release-date/theaters/metascore?page=1',
  'https://www.metacritic.com/browse/dvds/release-date/new-releases/metascore',
  'https://www.metacritic.com/browse/dvds/release-date/coming-soon/metascore',
]

export const parseMetascores = (html: string): Metascores => {
  const $ = cheerio.load(html)

  const metascores = {}
  const $movies = $('.clamp-list tr')
  $movies.each((i, element) => {
    const movie = $(element).find('a.title').text().trim()
    const score = +$(element).find('.metascore_w').first().text().trim()
    if (movie) {
      metascores[movie] = score
    }
  })
  return metascores
}

// Gets all ratings for movies in theaters from Metacritic
export const getMetascores = async (): Promise<Metascores> => {
  const emptyMetascores: Metascores = {}

  // We'll iterate through the URLs given, sequentially merging each
  // new dictionary of metascores with the previous one
  const metascoreReducer = async (metascores: Promise<Metascores>, url: string) => {
    const html = await scrape(url)
    const previousMetascores = await metascores
    return Object.assign(previousMetascores, parseMetascores(html))
  }

  return urls.reduce(metascoreReducer, Promise.resolve(emptyMetascores))
}
