import { pipe } from "fp-ts/lib/pipeable";
import { Block, NextOpen, TransactionData } from "./api/types";
import { join, map, split, def } from "./arrays";
import { mod10Hash } from "./mod10";
import { stringify, first, length, trampoline } from "./utils";
import { State } from "fp-ts/lib/State";
import { random } from "./random";

export type Hasher = State<string, string>

export type HashResult = [string, string]

export const mkHashResult = (hash: string) => (nonce: string): HashResult => [hash, nonce]

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

const randomNonce = (n0: number) => pipe(
  random(n0),
  ([n1, s]) => n1,
  stringify
)

export const mine = (n: NextOpen) => {
  const [algorithm, puzzle] = split(",")(n.algorithm)
  const matchesPuzzle = (s: string) => first(length(puzzle))(s) === puzzle
  const hasher = hashNew(n)

  const findNonce = ([hash, nonce]: HashResult) => matchesPuzzle(hash) ? mkHashResult(hash)(nonce) : () => pipe(nonce, parseInt, randomNonce, hasher, findNonce)

  return trampoline<HashResult>(() => findNonce(pipe(n.timestamp, randomNonce, mkHashResult(""))))()
}


