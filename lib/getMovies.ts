import getLocalMovies from './sensacine'

export async function getMovies() {
  const movies = await getLocalMovies()
  console.log({ movies })
  return movies
}
