import { alphaValues } from "./mod10"


export interface Fun<a,b> { (_: a): b }

export interface Action<a> extends Fun<a,a> {}

export interface ContinuationBase<a> { run: (cont: (output: a) => void) => void }

export interface Continuation<a> extends ContinuationBase<a> {

  map: <b>(f: Fun<a,b>) => Continuation<b>

  filter: (p: Fun<a, boolean>) => Continuation<a>

  never: <b>() => Continuation<b>

}

export interface IOContinuation<a,b> {
  (input: a): Continuation<b>
}

export const mkContinuation = <a>(c: ContinuationBase<a>): Continuation<a> => ({
  run: c.run,
  map: function<b>(f: Fun<a,b>): Continuation<b> { return map(f)(this) },
  filter: function(p: Fun<a,boolean>): Continuation<a> { return filter(p)(this) },
  never: function<b>(): Continuation<b> { return never(this) }
})

const map = <a, b>(f: Fun<a,b>) => (c: Continuation<a>) => mkContinuation({
  ...c,
  run: (cont: Fun<b, void>) => c.run(a => cont(f(a)))
})

const filter = <a>(p: Fun<a,boolean>): Action<Continuation<a>> => c => ({
  ...c,
  run: (cont: Fun<a, void>) => c.run(a => p(a) ? cont(a) : null)
})

const never = <a>(c: Continuation<{}>): Continuation<a> => mkContinuation({
  run: (cont: Fun<a, void>) => c.run(() => {})
})

export const nothing = <a>(): Continuation<a> => mkContinuation({
  run: (cont) => null
})

// stateful
export const stateful = <a>(c: IOContinuation<a,a>): IOContinuation<a,a> => (initialState: a) => {
  let state = initialState

  return mkContinuation({
    run: (cont) => c(state).run(x => { state = x; cont(x) })
  })
}

// promise
export const promise = <a,b>(p: Fun<a, Promise<b>>, onError: Fun<any, void> = () => {}): IOContinuation<a, b> => input => mkContinuation({
  run: (cont) => p(input).then(cont).catch(onError)
})

// async

// wait
export const wait = (ms: number): Continuation<{}> => mkContinuation<{}>({
  run: (cont) => setTimeout(cont, ms)
})

// any
export const any = <a>(cs: Continuation<a>[]) => mkContinuation<a>({
  run: (cont) => cs.map(c => c.run(cont))
})


