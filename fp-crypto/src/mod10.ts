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

export const tailFrom = <a>(i: number) => (a: a[]) => last(a, a.length - i)

const concat = <a>(a: a[]) => (b: a[]): a[] => [...a, ...b]

const first10 = <a>(_: a[]) => first<a>(10)(_)

const tailFrom10 = <a>(_: a[]) => tailFrom<a>(10)(_)

export const supplement = (x: number[]) => pipe(
  concat(x)([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
  first10
)

export const mapMerge = <a, b, c>(f: (x: [a, b]) => c) => ([[a, ...as], [b, ...bs]]: [a[], b[]]): c[] => def(a) && def(b) ? [f([a, b]), ...mapMerge(f)([as, bs])] : []

export const addAndMod10Array = mapMerge<number, number, number>(([a, b]) => (a + b) % 10)

const emptySet = [0,0,0,0,0,0,0,0,0,0]

export const mod10Array = (input: number[], state: number[] = emptySet): number[] => input.length > 0 ? mod10Array(tailFrom10(input), addAndMod10Array([supplement(first10(input)), state])) : state


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
