import { MovieInfo } from '../../types'

function calculateDisplayTitles(movie: MovieInfo) {
  const title = movie.originalTitle || movie.title || movie.localTitle
  const alternateTitle = movie.localTitle || movie.title
  movie.title = title
  if (alternateTitle !== title) movie.alternateTitle = alternateTitle
}

export default calculateDisplayTitles
