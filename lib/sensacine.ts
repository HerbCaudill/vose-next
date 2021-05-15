// Scrapes Sensacine for showtimes, one theater at a time

import * as cheerio from 'cheerio'
import * as Joda from 'js-joda'
import { MovieInfo, Showtime, Theater } from './types'
import scrape from './utils/scrape'

const ALL_THEATERS: Theater[] = [
  // { id: 'E0091', name: 'Aribau Multicines' },
  // { id: 'E0092', name: 'Aribau Club' },
  // { id: 'E0136', name: 'Bosque Multicines' },
  // { id: 'E0381', name: 'Cinesa Diagonal' },
  // { id: 'E0426', name: 'Cinema Comedia' },
  // { id: 'E0447', name: 'Gran Sarrià Multicines' },
  // { id: 'E0480', name: 'Méliès Cinemes' },
  // { id: 'E0544', name: 'Sala Phenomena Experience' },
  // { id: 'E0557', name: 'Palau Balaña Multicines' },
  // { id: 'E0581', name: 'Renoir Floridablanca' },
  // { id: 'E0608', name: 'Cines Verdi Barcelona' },
  // { id: 'E0613', name: 'Yelmo Cines Icaria' },
  // { id: 'E0682', name: 'Maldà Arts Forum' },
  // { id: 'E0747', name: 'Cinemes Girona' },
  // { id: 'E0764', name: 'Arenas Multicines' },
  // { id: 'E0802', name: 'Boliche Cinemes' },
  { id: 'E0808', name: 'Balmes Multicines' },
  // { id: 'E0850', name: 'Zumzeig Cinema' },
  // { id: 'E0873', name: 'Cinemes Texas' },
]

// Returns an array of Movie objects with VOSE showtimes for all theaters listed above
const getLocalMovies = async (theaters = ALL_THEATERS): Promise<MovieInfo[]> => {
  // We only want one entry for each movie; we use the local title as a key for now
  const movieLookup: Map<string, MovieInfo> = new Map()

  const theaterPages = await scrapeTheaters(theaters)
  for (const { page, theater } of theaterPages) {
    const theaterMovies = parseTheater(page)

    for (const { movie, times } of theaterMovies) {
      const key = movie.localTitle

      // Create a new movie entry by merging an empty object, any existing movie entry, and the current one
      const newMovieEntry = Object.assign({ showtimes: [] }, movieLookup.get(key), movie)
      // Add our showtimes (specific to this theater)
      newMovieEntry.showtimes.push({
        theater,
        times: times,
      })

      movieLookup.set(key, newMovieEntry)
    }
  }

  return Array.from(movieLookup.values())
}

// Returns an array of HTML pages scraped from sensacine
const scrapeTheaters = async (theaters: Theater[]) => {
  const result: { theater: Theater; page: string }[] = []

  for (const theater of theaters) {
    const url = `http://www.sensacine.com/cines/cine/${theater.id}`
    const page = await scrape(url)
    result.push({ theater, page })
  }
  return result
}

// Takes the HTML for one theater, returns an array of movies + showtimes
const parseTheater = (theaterHtml: string) => {
  const result: { movie: MovieInfo; times: Showtime[] }[] = []
  const $ = cheerio.load(theaterHtml)

  const $movies = $('div.hred')
  $movies.each((i: number, element: cheerio.Element) => {
    const html = $(element).html()
    if (html) {
      const $movie = cheerio.load(html)
      const movie = parseMovie($movie)
      const times = parseTimes($movie)
      if (times.length) {
        result.push({ movie, times })
      }
    }
  })

  return result
}

// Takes the HTML for one movie listing, returns the title + some metadata
export const parseMovie = ($: cheerio.Selector): MovieInfo => {
  function trimText() {
    return $(this).text().trim()
  }
  const trailerHref = $('a.thumbnail-container').attr('href')
  const movie: MovieInfo = {
    localTitle: $('a.meta-title-link').text().trim(),
    localPoster: $('img.thumbnail-img').attr('data-src') || $('img.thumbnail-img').attr('src'), //.replace('http:', 'https:'),
    localDescription: $('div.synopsis').text().trim(),
    localRating: +$('div.rating-item:contains("Medios")')
      .find('span.stareval-note')
      .text()
      .trim()
      .replace(',', '.'),
    trailerLink: trailerHref && `http://www.sensacine.com/${trailerHref}`,
    nationality: $('span.nationality').map(trimText).get(),
  }
  return movie
}

// Takes the HTML for one movie listing, returns an array of showtimes
const parseTimes = ($: cheerio.Selector): Showtime[] => {
  const times: Showtime[] = []

  const $today = $('.showtimes-anchor').first()
  const $versions = $today.find('.showtimes-version')
  $versions.each((_, v) => {
    const $version = $(v)
    const version = $(v).find('.text').text().split('En Versión')[1].trim()
    const $times = $version.find('.showtimes-hour-block')
    $times.each((_, t) => {
      const time = Joda.LocalTime.parse($(t).text().trim())
      times.push({ time, version })
    })
  })
  return times
}

export default getLocalMovies
export { scrapeTheaters, parseTheater, parseTimes } // for testing
// function isSpanishSpeakingCountry(country: string): boolean {
//   const SPANISH_SPEAKING = ['Espa&#xF1;a', 'España']
//   return SPANISH_SPEAKING.indexOf(country) !== -1
// }
