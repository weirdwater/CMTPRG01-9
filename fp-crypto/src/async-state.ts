import { Fun, IOContinuation, Action, mkContinuation, nothing } from "./continuation"

export interface UnloadedAsyncState {
  kind: 'unloaded'
}

export interface LoadingAsyncState {
  kind: 'loading'
}

export interface LoadedAsyncState<a> {
  kind: 'loaded'
  value: a
}

export interface ErrorAsyncState {
  kind: 'error'
  message: string
}

export type AsyncState<a> =
    | UnloadedAsyncState
    | LoadingAsyncState
    | LoadedAsyncState<a>
    | ErrorAsyncState

export const mkUnloadedAsync = (): UnloadedAsyncState => ({ kind: 'unloaded' })
export const mkLoadingAsync = (): LoadingAsyncState => ({ kind: 'loading' })
export const mkLoadedAsync = <a>(value: a): LoadedAsyncState<a> => ({ kind: 'loaded', value })
export const mkErrorAsync = (message: string): ErrorAsyncState => ({ kind: 'error', message })

export const isUnloaded = <a>(x: AsyncState<a>): x is UnloadedAsyncState => x.kind === 'unloaded'
export const isLoading = <a>(x: AsyncState<a>): x is LoadingAsyncState => x.kind === 'loading'
export const isLoaded = <a>(x: AsyncState<a>): x is LoadedAsyncState<a> => x.kind === 'loaded'
export const isError = <a>(x: AsyncState<a>): x is ErrorAsyncState => x.kind === 'error'

export const async = <a>(p: Fun<{},Promise<a>>): IOContinuation<AsyncState<a>, Action<AsyncState<a>>> => s0 => mkContinuation<Action<AsyncState<a>>>({
  run: (cont) => isLoaded(s0)
    ? null
    : isLoading(s0)
      ? p({})
        .then(x => cont(s1 => isLoading(s1) ? mkLoadedAsync(x) : s1))
        .catch(e => cont(s1 => isLoading(s1) ? mkErrorAsync(e) : s1))
      : null
})
