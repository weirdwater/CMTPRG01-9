import { pipe } from "fp-ts/lib/pipeable"

const def = <a>(x: a | undefined): x is a => typeof x !== 'undefined'

const undef = <a>(x: a | undefined): x is undefined => !def(x)

const map = <a, b>(f: (x: a) => b) => ([x, ...xs]: a[]): b[] => undef(x) ? [] : [f(x), ...map(f)(xs)]

const filter = <a>(p: (x: a) => boolean) => ([x, ...xs]: a[]): a[] => def(x) ? p(x) ? [x, ...filter<a>(p)(xs)] : filter<a>(p)(xs) : []

const flatten = <a>([x, ...xs]: a[][]): a[] => def(x) ? Array.isArray(x) ? [...x, ...flatten(xs)] : [x, ...flatten(xs)] : []

const first = <a>(n: number = 1) => ([x, ...xs]: a[]): a[] => n && def(x) ? [x, ...first<a>(n - 1)(xs)] : []

const head = <a>([x]: a[]) => x

const tail = <a>([,...xs]: a[]) => xs

export const last = <a>([x, ...xs]: a[], n: number = 1): a[] => def(x) ? n > xs.length ? [x, ...last<a>(xs, n)] : [...last<a>(xs, n)] : []

const concat = <a>(a: a[]) => (b: a[]): a[] => [...a, ...b]

const append = <a>(b: a[]) => (a: a[]): a[] => concat(a)(b)

export const supplement = (x: number[]) => pipe(
  append([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])(x),
  first<number>(10)
)

export const addAndMod10Array = ([a, ...as]: number[], [b, ...bs]: number[]): number[] => def(a) && def(b) ? [(a + b) % 10, ...addAndMod10Array(as, bs)] : []

export const mod10Array = (a: number[]): number[] => a


export const mod10 = (s: string): string => {

  const digits = pipe(
    alphaValues(s),
    filter(x => x !== 32), // filter out spaces (Should this be done here? Or is it the responsibility of the caller?)
    map(x => x.toString(10).split("")),
    flatten,
    map(x => parseInt(x, 10))
  )



  return s
}

export const alphaValues = (s: string): number[] => s.split('')
  .map(c => isAlphaChar(c) ? c.charCodeAt(0) : parseInt(c))

const isAlphaChar = (c: string) => Object.is(parseInt(c, 10), NaN)
