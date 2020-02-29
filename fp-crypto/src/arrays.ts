
export const def = <a>(x: a | undefined): x is a => typeof x !== 'undefined'

export const undef = <a>(x: a | undefined): x is undefined => !def(x)

export const map = <a, b>(f: (x: a) => b) => ([x, ...xs]: a[]): b[] => undef(x) ? [] : [f(x), ...map(f)(xs)]

export const reduce = <a, b>(f: (m: b, x: a, i: number) => b, memo: b, i: number = 0) => ([x, ...xs]: a[]): b => def(x) ? reduce(f, f(memo, x, i), i + 1)(xs) : memo

export const filter = <a>(p: (x: a) => boolean) => ([x, ...xs]: a[]): a[] => def(x) ? p(x) ? [x, ...filter<a>(p)(xs)] : filter<a>(p)(xs) : []

export const flatten = <a>([x, ...xs]: a[][]): a[] => def(x) ? Array.isArray(x) ? [...x, ...flatten(xs)] : [x, ...flatten(xs)] : []

export const first = (n: number = 1) => <a>([x, ...xs]: a[]): a[] => n && def(x) ? [x, ...first(n - 1)(xs)] : []

export const head = first(1)

export const last = (n: number = 1) => <a>([x, ...xs]: a[]): a[] => def(x) ? n > xs.length ? [x, ...last(n)(xs)] : [...last(n)(xs)] : []

export const tailFrom = (i: number) => <a>(x: a[]) => last(x.length - i)(x)

export const tail = tailFrom(1)

export const concat = <a>(a: a[]) => (b: a[]): a[] => [...a, ...b]

export const join = (d: string = "") => reduce<string, string>((m, x) => m + d + x, "")

export const split = (d: string = "") => (a: string) => a.split(d)
