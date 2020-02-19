import { State, state, chain } from 'fp-ts/lib/State'
import { pipe } from 'fp-ts/lib/pipeable'
import { sequenceT, sequenceS } from 'fp-ts/lib/Apply'

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

export const randomFullName: Random<string> =
  pipe(
    sequenceT(state)(randomFirstName, randomLastName),
    map(([first, last]) => `${first} ${last}`)
  )

export const randomBoolean: Random<boolean> =
  pipe(
    randomInRange(0, 1),
    map(n => n === 1)
  )

export const randomHockeyTeam: Random<string> = randomIn(['Maple Leafs', 'Canadiens', 'Flyers', 'Bruins'])
export const randomFootballTeam: Random<string> = randomIn(['Steelers', 'Eagles', 'Jaguars'])

export const randomTeam: Random<string> =
  pipe(
    randomBoolean,
    chain(b => b ? randomHockeyTeam : randomFootballTeam)
  )

export const _chain: <S, A, B>(f: (a: A) => State<S, B>) => (fa: State<S, A>) => State<S, B> =
  f => generate => seed0 => {
    const [a, seed1] = generate(seed0)
    return f(a)(seed1)
  }

export const generateRandomUser = sequenceS(state)({
  name: randomFullName,
  age: randomInRange(18,100),
  favoriteTeam: randomTeam
})

