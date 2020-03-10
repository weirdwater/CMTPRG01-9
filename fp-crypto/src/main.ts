import { getNext, getRandomNumber, publishNonce } from "./api";
import { Next, NextClosed, NextOpen, SolutionResponse, Block } from "./api/types";
import { async, AsyncState, isLoaded, isUnloaded, LoadedAsyncState, mkLoadedAsync, mkLoadingAsync, mkUnloadedAsync } from "./async-state";
import { Action, any, IOContinuation, mkContinuation, nothing, once, stateful, wait, promise } from "./continuation";
import { HashResult, mine, isHashResult } from "./hash-block";
import { traceAction, stringify } from "./utils";
import { mineworkerpool, PoolState, mkIdlePoolState } from "./miner-pool";

const c_mine = (block: NextOpen): IOContinuation<string,HashResult> => (nonce) => mkContinuation({
  run: (cont) => cont(mine(block)(nonce))
})

interface InitNonceState {
  stage: 'init - nonce'
  nextBlock: AsyncState<Next>
  nonce: AsyncState<string>
}

interface InitNextState {
  stage: 'init - next'
  nextBlock: AsyncState<Next>
  nonce: LoadedAsyncState<string>
}

interface NextClosedState {
  stage: 'next - closed',
  nextBlock: LoadedAsyncState<NextClosed>
  nonce: LoadedAsyncState<string>
}

interface NextOpenState {
  stage: 'next - open',
  nextBlock: LoadedAsyncState<NextOpen>
  nonce: LoadedAsyncState<string>
  workers: PoolState<HashResult>
}

interface NonceFoundState {
  stage: 'nonce - found'
  nextBlock: LoadedAsyncState<NextOpen>
  nonce: LoadedAsyncState<string>
  reward: AsyncState<SolutionResponse>
}

type AppState =
  | InitNonceState
  | InitNextState
  | NextOpenState
  | NextClosedState
  | NonceFoundState

const initialState: AppState = {
  stage: 'init - nonce',
  nextBlock: mkUnloadedAsync(),
  nonce: mkUnloadedAsync()
}

const startWithNonce = (n: string): AppState => ({
  stage: 'init - next',
  nextBlock: mkUnloadedAsync(),
  nonce: mkLoadedAsync(n)
})

const pluralizeNonce = (n: string) => {
  const d = parseInt(n)
  return [ n, stringify(d / 2), stringify(d * 2), stringify(d % 12345) ]
}

stateful<AppState>(s0 => any<Action<AppState>>([
    s0.stage === 'init - nonce'
      ? any<Action<AppState>>([
        isUnloaded(s0.nonce) ? once().map(() => s1 => s1.stage === 'init - nonce' ? {...s1, nonce: mkLoadingAsync() } : s1) : nothing(),
        async(getRandomNumber)(s0.nonce).map(a => s1 => {
          const n1 = a(s1.nonce)
          return s1.stage === 'init - nonce' ? isLoaded(n1)
            ? { ...s1, stage: 'init - next',  nonce: n1 }
            : { ...s1, nonce: n1 }
          : s1
        }),
      ]).map(a => s1 => a(s1))
    : s0.stage === 'init - next'
      ? any<Action<AppState>>([
        isUnloaded(s0.nextBlock) ? once().map(() => s1 => s1.stage === 'init - next' ? {...s1, nextBlock: mkLoadingAsync() } : s1) : nothing(),
        async(getNext)(s0.nextBlock).map(a => s1 => {
          const n1 = a(s1.nextBlock)
          return s1.stage === 'init - next'
            ? isLoaded(n1)
              ? n1.value.open
                ? {...s1, stage: 'next - open', nextBlock: mkLoadedAsync(n1.value), workers: mkIdlePoolState()}
                : {...s1, stage: 'next - closed', nextBlock: mkLoadedAsync(n1.value)}
              : {...s1, nextBlock: n1}
            : s1
        }),
      ]).map(a => s1 => a(s1))
    : s0.stage === 'next - closed'
      ? wait(s0.nextBlock.value.countdown).map<Action<AppState>>(() => s1 => s1.stage === 'next - closed' ? { ...s1, stage: 'init - next', nextBlock: mkUnloadedAsync() } : s1)
    : s0.stage === 'next - open'
      ? any<Action<AppState>>([
        wait(s0.nextBlock.value.countdown).map<Action<AppState>>(() => s1 => s1.stage === 'next - open' ? { ...s1, stage: 'init - next', nextBlock: mkUnloadedAsync() } : s1),
        mineworkerpool(s0.nextBlock.value)(pluralizeNonce(s0.nonce.value))(s0.workers).map(a => s1 => s1.stage === 'next - open' ? {...s1, workers: a(s1.workers)} : s1)
      ])
    : s0.stage === 'nonce - found'
      ? async(() => publishNonce('Arjo 0902252')(s0.nonce.value))(s0.reward).map(a => s1 => s1.stage === 'nonce - found' ? {...s1, reward: a(s1.reward) } : s1)
    : nothing()
  ]).map(a => traceAction('AppState')(a)(s0))
  // ]).map(a => a(s0))
)(initialState).run(s => {})

