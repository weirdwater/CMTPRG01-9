import { mine, HashResult } from "./hash-block";
import { NextOpen, Block, Next } from "./api/types";
import { any, wait, promise, stateful, nothing } from "./continuation";
import axios from 'axios'
import { getNext } from "./api";

const block0: Block = {
  _id: "5c5003d55c63d51f191cadd6",
  algorithm: "mod10sha,0000",
  hash: "000078454c038871fa4d67b0022a30baaf25eaa231f8991b108e2624f052f3f8",
  nonce: "10312",
  timestamp: 1548747788716,
  __v: 0,
  data: [
      {
          _id: "5c4f20695c63d51f191cadd1",
          from: "CMGT Mining Corporation",
          to: "Bob PIKAB",
          amount: 1,
          timestamp: 1548689513858
      }
  ]
}

const next: NextOpen = {
  blockchain: block0,
  transactions: [
      {
          _id: "5c5003d55c63d51f191cadd7",
          from: "CMGT Mining Corporation",
          to: "Bas BOOTB",
          amount: 1,
          timestamp: 1548747733261,
          __v: 0
      }
  ],
  timestamp: 1548748101396,
  algorithm: "mod10sha,0000",
  open: true,
  countdown: 57235
}

const _mine = (n: NextOpen) => (nonce: string) => new Promise<HashResult>(res => res(mine(n)(nonce)))

stateful<string>(s => any<string>([
  promise<string,HashResult>(_mine(next))('3926').map(([hash, nonce]) => `With ${nonce} as nonce the next block's hash is ${hash}.`),
  promise<{},Next>(getNext)({}).map(n => `Chain is ${n.open ? 'open' : 'closed'} for ${n.countdown / 1000} seconds.`)
]))('start').run(s => console.log(`run: ${s}`))
