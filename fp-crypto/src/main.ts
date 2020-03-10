import { getNext, getRandomNumber } from "./api";
import { Next, NextClosed, NextOpen } from "./api/types";
import { async, AsyncState, isLoaded, isUnloaded, LoadedAsyncState, mkLoadedAsync, mkLoadingAsync, mkUnloadedAsync } from "./async-state";
import { Action, any, IOContinuation, mkContinuation, nothing, once, stateful, wait } from "./continuation";
import { HashResult, mine } from "./hash-block";
import { traceAction } from "./utils";

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
}

type AppState =
  | InitNonceState
  | InitNextState
  | NextOpenState
  | NextClosedState

const initialState: AppState = {
  stage: 'init - nonce',
  nextBlock: mkUnloadedAsync(),
  nonce: mkUnloadedAsync()
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
                ? {...s1, stage: 'next - open', nextBlock: mkLoadedAsync(n1.value)}
                : {...s1, stage: 'next - closed', nextBlock: mkLoadedAsync(n1.value)}
              : {...s1, nextBlock: n1}
            : s1
        }),
      ]).map(a => s1 => a(s1))
    : s0.stage === 'next - closed'
      ? wait(s0.nextBlock.value.countdown).map<Action<AppState>>(() => s1 => s1.stage === 'next - closed' ? { ...s1, stage: 'init - next', nextBlock: mkUnloadedAsync() } : s1)
    : s0.stage === 'next - open'
      ? wait(s0.nextBlock.value.countdown).map<Action<AppState>>(() => s1 => s1.stage === 'next - open' ? { ...s1, stage: 'init - next', nextBlock: mkUnloadedAsync() } : s1)
    : nothing()
  ]).map(a => traceAction('AppState')(a)(s0))
)(initialState).run(s => {})

