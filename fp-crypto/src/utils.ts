import { Transaction } from "./api/types"
import { Functor } from "fp-ts/lib/Functor"
import { Action } from "./continuation"

export const stringify = (x: { toString: () => string }) => x.toString()

export const getProperty = <a, b extends keyof a = keyof a>(k: b) => (a: a): a[b] => a[k]

export const first = (n: number) => (s: string) => s.substr(0, n)

export const length = (s: { length: number }) => s.length

export const isFunction = <a extends () => void>(x: any): x is a => typeof x === 'function'

export type ThunkOrValue<a> = a | (() => ThunkOrValue<a>)

const isLazy = <a>(x: ThunkOrValue<a>): x is (() => a) => typeof x === 'function'

export const trampoline = <a>(f: () => ThunkOrValue<a>) => (): a => {
  let result = f()
  while (result instanceof Function) {
    result = result()
  }
  return result
}

const sumBelowRec = (number: number, sum: number = 0): ThunkOrValue<number> =>
  number === 0
    ? sum
    : () => sumBelowRec(number - 1, sum + number)

export const prettyPrint = (o: any) => JSON.stringify(o, null, 2)

export const traceAction = (label: string) => <a>(a: Action<a>) => (i: a) => {
  console.group(`\n${label} update`)
      console.group('old', label)
      console.log(prettyPrint(i))
      console.groupEnd()
    const o = a(i)
      console.group('new', label)
      console.log(prettyPrint(o))
      console.groupEnd()
    console.groupEnd()
    return o
}

export const trace = (label: string) => <a>(x: a): a => {
  console.log(label, x)
  return x
}
