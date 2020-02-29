import crypto from 'crypto'
import { pipe } from "fp-ts/lib/pipeable"
import { concat, def, filter, first, flatten, map, reduce, tailFrom } from "./arrays"

const first10 = first(10)

const tailFrom10 = tailFrom(10)

export const supplement = (x: number[]) => pipe(
  concat(x)([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
  first10
)

export const mapMerge = <a, b, c>(f: (x: [a, b]) => c) => ([[a, ...as], [b, ...bs]]: [a[], b[]]): c[] => def(a) && def(b) ? [f([a, b]), ...mapMerge(f)([as, bs])] : []

export const mergeMod10 = mapMerge<number, number, number>(([a, b]) => (a + b) % 10)

const emptySet = [0,0,0,0,0,0,0,0,0,0]

export const mod10 = (input: number[], state: number[] = emptySet): number[] => input.length > 0 ? mod10(tailFrom10(input), mergeMod10([supplement(first10(input)), state])) : state

const sha256 = (s: crypto.BinaryLike) => crypto.createHash('sha256').update(s).digest('hex')

export const alphaValues = (s: string): number[] => s.split('').map(c => isAlphaChar(c) ? c.charCodeAt(0) : parseInt(c))

const isAlphaChar = (c: string) => Object.is(parseInt(c, 10), NaN)

export const mod10Hash = (s: string): string => pipe(
  alphaValues(s),
  filter(x => x !== 32), // filter out spaces (Should this be done here? Or is it the responsibility of the caller?)
  map(x => x.toString(10).split("")),
  flatten,
  map(x => parseInt(x, 10)),
  mod10,
  map(x => x.toString(10)),
  reduce<string, string>((m, x) => m + x, ""),
  sha256
)

