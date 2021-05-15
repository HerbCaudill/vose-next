import { parseMetascores } from '../lib/metacritic'
import { read } from './utils/assets'

it('gets metascores', async () => {
  const metascores = {
    ...parseMetascores(read.asset('metacritic-movies.html')),
    ...parseMetascores(read.asset('metacritic-dvds.html')),
  }
  expect(metascores['Atlantis']).toEqual(85)
  expect(metascores['Silo']).toEqual(43)
  expect(metascores['Mayor']).toEqual(75)
})
