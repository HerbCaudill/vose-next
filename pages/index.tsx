import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { getMovies } from '../lib/getMovies'
import { MovieInfo } from '../lib/types'

function Page({ movies }: PageProps) {
  return movies.map(m => {
    return <p key={m.id}> {m.title} </p>
  })
}

export const getStaticProps: GetStaticProps = async () => {
  const movies = await getMovies()

  return {
    props: {
      movies,
    },
    revalidate: 60 * 60, // 1 hr
  }
}

type PageProps = {
  movies: MovieInfo[]
}

export default Page
