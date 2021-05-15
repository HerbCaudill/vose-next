import { MovieInfo } from '../../types'

// Metascore is from 0-100, local rating is from 0-5, TMDB rating is from 0-10.
// We might have zero or one or all of these.
// This returns an average score on a 0-100 scale.
function getCompositeScore(movie: MovieInfo) {
  const scores = [] as number[]
  // Put all scores on 0-100 scale
  if (movie.metascore) scores.push(movie.metascore) //          originally on 0-100 scale
  if (movie.localRating) scores.push(movie.localRating * 20) // originally on 0-5 scale
  if (movie.tmdbRating) scores.push(movie.tmdbRating * 10) //   originally on 0-10 scale
  if (scores.length > 0) {
    const average = (a: number[]): number => a.reduce((p, c) => p + c, 0) / a.length
    return average(scores)
  } else return undefined
}

export default getCompositeScore
