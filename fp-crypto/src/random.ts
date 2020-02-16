import { State } from 'fp-ts/lib/State'
import { pipe } from 'fp-ts/lib/pipeable'

const M = 8239451023

type Random<a> = State<number, a>

export const random: Random<number> = (seed: number) => {
  const nextSeed = (1839567234 * seed + 972348567) % M
  return [nextSeed, nextSeed]
}

const map: <A, B>(f: (a: A) => B) => <E>(fa: State<E, A>) => State<E, B> = f => generate => seed => {
  const [a, nextSeed] = generate(seed)
  return [f(a), nextSeed]
}

export const randomInRange = (min: number, max: number): Random<number> =>
  pipe(
    random,
    map(num => min + Math.floor((num / M) * (max - min)))
  )

const firstNames = ['Paul', 'Nicole', 'Zane', 'Ellie']
const lastNames = ['Gray', 'Smith', 'Jones', 'Williams']

export const randomIn = <a>(array: a[]): Random<a> =>
  pipe(
    randomInRange(0, array.length - 1),
    map(index => array[index])
  )

export const randomFirstName = randomIn(firstNames)
export const randomLastName = randomIn(lastNames)
