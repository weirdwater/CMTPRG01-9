import { pipe } from "fp-ts/lib/pipeable"
import crypto from 'crypto'

const def = <a>(x: a | undefined): x is a => typeof x !== 'undefined'

const undef = <a>(x: a | undefined): x is undefined => !def(x)

const map = <a, b>(f: (x: a) => b) => ([x, ...xs]: a[]): b[] => undef(x) ? [] : [f(x), ...map(f)(xs)]

const reduce = <a, b>(f: (m: b, x: a, i: number) => b, memo: b, i: number = 0) => ([x, ...xs]: a[]): b => def(x) ? reduce(f, f(memo, x, i), i + 1)(xs) : memo

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

export const mergeMod10 = mapMerge<number, number, number>(([a, b]) => (a + b) % 10)

const emptySet = [0,0,0,0,0,0,0,0,0,0]

export const mod10 = (input: number[], state: number[] = emptySet): number[] => input.length > 0 ? mod10(tailFrom10(input), mergeMod10([supplement(first10(input)), state])) : state

const sha256 = (s: crypto.BinaryLike) => crypto.createHash('sha256').update(s).digest('hex')

export const alphaValues = (s: string): number[] => s.split('')
  .map(c => isAlphaChar(c) ? c.charCodeAt(0) : parseInt(c))

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

