import { mine, HashResult, hashNew } from "./hash-block";
import { NextOpen, Block, Next } from "./api/types";
import { any, wait, promise, stateful, nothing, mkContinuation, IOContinuation, Action, once } from "./continuation";
import axios from 'axios'
import { getNext, getRandomNumber } from "./api";
import { AsyncState, mkUnloadedAsync, mkLoadedAsync, isUnloaded, mkLoadingAsync, async, isLoading } from "./async-state";
import { pipe } from "fp-ts/lib/pipeable";

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

const c_mine = (block: NextOpen): IOContinuation<string,HashResult> => (nonce) => mkContinuation({
  run: (cont) => cont(mine(block)(nonce))
})

interface InitState {
  stage: 'init'
  nextBlock: AsyncState<Next>
  nonce: AsyncState<string>
}

type AppState = InitState

const initialState: AppState = {
  stage: 'init',
  nextBlock: mkUnloadedAsync(),
  nonce: mkUnloadedAsync()
}

stateful<AppState>(s0 => any<Action<AppState>>([
    s0.stage === 'init'
      ? any<Action<AppState>>([
        // isUnloaded(s0.nextBlock)
        //   ? any<Action<AppState>>([
        //       promise<{},Next>(getNext)({}).map(n => s1 => s1.stage === 'init' && isUnloaded(s1.nextBlock) ? {...s1, nextBlock: mkLoadedAsync(n)} : s1),
        //       once().map(() => s1 => s1.stage === 'init' && isUnloaded(s1.nextBlock) ? {...s1, nextBlock: mkLoadingAsync() } : s1)
        //     ])
        //   : nothing(),
        // isUnloaded(s0.nonce)
        //   ? any<Action<AppState>>([
        //       promise<{},string>(getRandomNumber)({}).map(n => s1 => s1.stage === 'init' && isUnloaded(s1.nonce) ? {...s1, nonce: mkLoadedAsync(n)} : s1),
        //       once().map(() => s1 => s1.stage === 'init' && isUnloaded(s1.nonce) ? {...s1, nonce: mkLoadingAsync() } : s1)
        //     ])
        //   : nothing(),
        isUnloaded(s0.nextBlock) ? once().map(() => s1 => s1.stage === 'init' && isUnloaded(s1.nextBlock) ? {...s1, nextBlock: mkLoadingAsync() } : s1) : nothing(),
        isUnloaded(s0.nonce) ? once().map(() => s1 => s1.stage === 'init' && isUnloaded(s1.nonce) ? {...s1, nonce: mkLoadingAsync() } : s1) : nothing(),
        async(getNext)(s0.nextBlock).map(a => s1 => s1.stage === 'init' && isLoading(s1.nextBlock) ? {...s1, nextBlock: a(s1.nextBlock)} : s1),
        async(getRandomNumber)(s0.nonce).map(a => s1 => s1.stage === 'init' && isLoading(s1.nonce) ? {...s1, nonce: a(s1.nonce)} : s1),
      ]).map(a => s1 => a(s1))
      : nothing()
  ]).map(a => {
    console.group(`\nState update`)
    console.log('old state:', s0)
    const newState = a(s0)
    console.log('new state:', newState)
    console.groupEnd()
    return newState
  })
)(initialState).run(s => {})

