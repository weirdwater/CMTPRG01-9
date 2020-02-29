import { pipe } from "fp-ts/lib/pipeable";
import { Block, NextOpen, TransactionData } from "./api/types";
import { join, map, split, def } from "./arrays";
import { mod10Hash } from "./mod10";
import { stringify, first } from "./utils";
import { State } from "fp-ts/lib/State";
import { random } from "./random";

export type Hasher = State<string, string>


const transactionToString = (t: TransactionData) => pipe(
  [ t.from, t.to, t.amount, t.timestamp ],
  map(stringify),
  join("")
)

export const hashBlock = (previous: string) => (transactions: TransactionData[]) => (timestamp: number): Hasher => nonce => pipe(
  [
    previous,
    pipe(transactions, map(transactionToString), join("")),
    timestamp,
    nonce
  ],
  map(stringify),
  join(""),
  mod10Hash,
  h => [h, nonce]
)

export const blockToHash = (b: Block) => hashBlock(b.hash)(b.data)(b.timestamp)(b.nonce)

export const hashNew = (next: NextOpen) => pipe(
  blockToHash(next.blockchain),
  ([h, n]) => hashBlock(h)(next.transactions)(next.timestamp)
)

const matchesPuzzle = (p: string) => (s: string) => {console.log(p, first(p.length)(s), s) ; return first(p.length)(s) === p}

const randomNonce = (n0: number) => pipe(
  random(n0),
  ([n1, s]) => n1,
  stringify
)

export const mine = (n: NextOpen) => {
  const [a, p] = split(",")(n.algorithm)
  const hasher = hashNew(n)

  // const findNonce = (maxDepth: number = 500) => ([hash, nonce]: [string, string]): [string, string] => matchesPuzzle(p)(hash) || maxDepth === 0 ? [hash, nonce] : pipe(nonce, parseInt, randomNonce, hasher, findNonce(maxDepth - 1))
  const findNonce = ([hash, nonce]: [string, string]): [string, string] => matchesPuzzle(p)(hash) ? [hash, nonce] : pipe(nonce, parseInt, randomNonce, hasher, findNonce)




  return pipe(n.timestamp, randomNonce, hasher, findNonce)
}
