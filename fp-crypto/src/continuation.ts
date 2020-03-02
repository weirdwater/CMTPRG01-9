

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
  run: (c: Fun<a, void>) => null
})

// stateful

// promise

// async

// wait

// any

// first?
