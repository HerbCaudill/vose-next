import * as cheerio from 'cheerio'
import { LocalTime } from 'js-joda'
import * as sensacine from '../lib/sensacine'
import { read } from './utils/assets'

const BALMES = () => read.asset('theater.html')

function FIRST() {
  const $BALMES = cheerio.load(BALMES())
  const firstListing = $BALMES('div.hred').first().html() || ''
  console.log(firstListing)
  return cheerio.load(firstListing)
}

it('scrapes a movie', () => {
  const $movie = FIRST()
  const movie = sensacine.parseMovie($movie)
  expect(movie).toEqual({
    localTitle: 'El Señor de los Anillos: El retorno del Rey',
    localDescription: expect.stringContaining('El ejército de Sauron ha atacado Minas Tirith'),
    localPoster: 'https://es.web.img3.acsta.net/c_160_213/medias/nmedia/18/89/68/19/20061877.jpg',
    trailerLink: undefined,
    localRating: 4.6,
    nationality: ['Nueva Zelanda', 'EE.UU.'],
  })
})

it('scrapes showtimes', async () => {
  const $movie = FIRST()
  const showtimes = sensacine.parseTimes($movie)
  expect(showtimes).toEqual([{ time: LocalTime.parse('18:25'), version: 'doblada' }])
})

it('scrapes a theater', async () => {
  const moviesAndTimes = sensacine.parseTheater(BALMES())
  expect(moviesAndTimes.map(d => d.movie.localTitle)).toEqual([
    'El Señor de los Anillos: El retorno del Rey',
    'Ejército de los muertos',
    'Borrar el historial',
    'Este cuerpo me sienta de muerte',
    'Hijos del Sol',
    'Amanece en Calcuta',
    'Guardianes de la noche: Tren infinito',
    'Minari. Historia de mi familia',
    'Nadie (Nobody)',
    'El padre',
    'Vivo',
    'El olvido que seremos',
    'Otra ronda',
    'Una joven prometedora',
    'Quo Vadis, Aida?',
    'Nomadland',
    'Aquellos que desean mi muerte',
  ])
})
