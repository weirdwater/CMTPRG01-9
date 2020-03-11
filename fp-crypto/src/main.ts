import colors from 'colors';
import { getNext, getRandomNumber, publishNonce } from "./api";
import { Next, NextClosed, NextOpen } from "./api/types";
import { async, AsyncState, isError, isLoaded, isUnloaded, LoadedAsyncState, mkLoadedAsync, mkLoadingAsync, mkUnloadedAsync } from "./async-state";
import { Action, any, nothing, once, stateful, wait } from "./continuation";
import { HashResult } from "./hash-block";
import { mineworker } from "./miner-pool";
import { fst, snd } from "./utils";

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
  newNonce: AsyncState<HashResult>
}

interface NonceFoundState {
  stage: 'nonce - found'
  nextBlock: LoadedAsyncState<NextOpen>
  nonce: LoadedAsyncState<string>
  reward: AsyncState<boolean>
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
                ? {...s1, stage: 'next - open', nextBlock: mkLoadedAsync(n1.value), newNonce: mkLoadingAsync()}
                : {...s1, stage: 'next - closed', nextBlock: mkLoadedAsync(n1.value)}
              : {...s1, nextBlock: n1}
            : s1
        }),
      ]).map(a => s1 => a(s1))
    : s0.stage === 'next - closed'
      ? wait(s0.nextBlock.value.countdown).map<Action<AppState>>(() => s1 => s1.stage === 'next - closed' ? { ...s1, stage: 'init - next', nextBlock: mkLoadingAsync() } : s1)
    : s0.stage === 'next - open'
      ? any<Action<AppState>>([
        async(() => mineworker(s0.nextBlock.value)(s0.nonce.value))(s0.newNonce).map(a => s1 => {
          if (s1.stage !== 'next - open') return s1
          const newNonce = a(s1.newNonce)
          if (isError(newNonce)) {
            console.log(colors.yellow('Could not find nonce in time. Retrieving next block information.'))
            return { stage: 'init - next', nextBlock: mkLoadingAsync(), nonce: s1.nonce }
          }
          if (isLoaded(newNonce)) {
            console.log(colors.green(`Found nonce ${snd(newNonce.value)} for hash ${fst(newNonce.value)}. Claiming reward.`))
            return { stage: 'nonce - found', nonce: mkLoadedAsync(newNonce.value[1]), reward: mkLoadingAsync(), nextBlock: s1.nextBlock }
          }
          return {...s1, newNonce }
        }),
      ])
    : s0.stage === 'nonce - found'
      ? async(() => publishNonce('Arjo 0902252')(s0.nonce.value))(s0.reward).map(a => s1 => {
        if (s1.stage !== 'nonce - found') return s1

        const reward = a(s1.reward)
        console.log(reward ? colors.green('🎉 Block rewarded! 🍻') : colors.red('😣 Nonce expired.'))

        return { stage: 'init - next', nextBlock: mkUnloadedAsync(), nonce: s1.nonce }
      })
    : nothing()
  // ]).map(a => traceAction('AppState')(a)(s0))
  // ]).map(a => a(s0))
  ]).map(a => {
    const s1 = a(s0)
    console.log(`\n${s0.stage} ~> ${s1.stage}`)
    return s1
  })
)(initialState).run(s => {})

