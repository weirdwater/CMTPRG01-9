import { Transaction } from "./api/types"
import { Functor } from "fp-ts/lib/Functor"

export const stringify = (x: { toString: () => string }) => x.toString()

export const getProperty = <a, b extends keyof a = keyof a>(k: b) => (a: a): a[b] => a[k]

export const first = (n: number) => (s: string) => s.substr(0, n)
