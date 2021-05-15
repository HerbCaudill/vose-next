import * as Joda from 'js-joda'

export type MovieInfo = {
  id?: number

  localTitle: string // sensacine (often in Spanish)
  title?: string // tmdb title (generally in English)
  originalTitle?: string // tmdb title in original language
  alternateTitle?: string // we calculate this based on all of the above

  nationality: string[]

  poster?: string
  localPoster?: string
  description?: string
  localDescription?: string
  releaseDate?: Joda.LocalDate
  language?: string
  countries?: string[]
  languages?: string[]
  runtime?: number
  genres?: string[]
  trailerLink?: string
  localRating?: number
  tmdbRating?: number
  metascore?: number
  compositeScore?: number
  showtimes?: Showtimes[]
}

export type Showtime = {
  time: Joda.LocalTime
  version: string
}

export type Theater = {
  id?: string
  name?: string
}

export type Showtimes = {
  theater?: Theater
  times?: Joda.LocalTime[]
}

export type Metascores = {
  [title: string]: number
}
