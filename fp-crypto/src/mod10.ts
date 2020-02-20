import { pipe } from "fp-ts/lib/pipeable"

const def = <a>(x: a | undefined): x is a => typeof x !== 'undefined'

const undef = <a>(x: a | undefined): x is undefined => !def(x)

const map = <a, b>(f: (x: a) => b) => ([x, ...xs]: a[]): b[] => undef(x) ? [] : [f(x), ...map(f)(xs)]

const filter = <a>(p: (x: a) => boolean) => ([x, ...xs]: a[]): a[] => def(x) ? p(x) ? [x, ...filter<a>(p)(xs)] : filter<a>(p)(xs) : []

const flatten = <a>([x, ...xs]: Array<a|a[]>): a[] => def(x) ? Array.isArray(x) ? [...x, ...flatten(xs)] : [x, ...flatten(xs)] : []

export const addAndMod10 = (a: number, b: number) => (a + b) % 10

export const addAndMod10Array = ([a, ...as]: number[], [b, ...bs]: number[]): number[] => def(a) && def(b) ? [(a + b) % 10, ...addAndMod10Array(as, bs)] : []

export const mod10Array = (a: number[]): number[] => a


export const mod10 = (s: string): string => {

  const digits = pipe(
    alphaValues(s),
    // filter(x => x !== 32), // filter out spaces (Should this be done inside the hashing function?)
    map(x => x.toString(10).split("")),
    flatten,
    map(x => parseInt(x, 10))
  )

  return s
}

export const alphaValues = (s: string): number[] => s.split('')
  .map(c => Object.is(parseInt(c, 10), NaN) ? c.charCodeAt(0) : parseInt(c))
