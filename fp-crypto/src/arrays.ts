
export const def = <a>(x: a | undefined): x is a => typeof x !== 'undefined'

export const undef = <a>(x: a | undefined): x is undefined => !def(x)

export const map = <a, b>(f: (x: a) => b) => ([x, ...xs]: a[]): b[] => undef(x) ? [] : [f(x), ...map(f)(xs)]

export const reduce = <a, b>(f: (m: b, x: a, i: number) => b, memo: b, i: number = 0) => ([x, ...xs]: a[]): b => def(x) ? reduce(f, f(memo, x, i), i + 1)(xs) : memo

export const filter = <a>(p: (x: a) => boolean) => ([x, ...xs]: a[]): a[] => def(x) ? p(x) ? [x, ...filter<a>(p)(xs)] : filter<a>(p)(xs) : []

export const flatten = <a>([x, ...xs]: a[][]): a[] => def(x) ? Array.isArray(x) ? [...x, ...flatten(xs)] : [x, ...flatten(xs)] : []

export const first = <a>(n: number = 1) => ([x, ...xs]: a[]): a[] => n && def(x) ? [x, ...first<a>(n - 1)(xs)] : []

export const head = <a>([x]: a[]) => x

export const tail = <a>([,...xs]: a[]) => xs

export const last = <a>([x, ...xs]: a[], n: number = 1): a[] => def(x) ? n > xs.length ? [x, ...last<a>(xs, n)] : [...last<a>(xs, n)] : []

export const tailFrom = <a>(i: number) => (a: a[]) => last(a, a.length - i)

export const concat = <a>(a: a[]) => (b: a[]): a[] => [...a, ...b]
