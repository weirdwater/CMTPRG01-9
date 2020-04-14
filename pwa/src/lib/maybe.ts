import { Fun } from "./fun"

export interface SomeBase<a> {
  kind: 'some'
  value: a
}

export interface NoneBase {
  kind: 'none'
}

export type MaybeBase<a> = SomeBase<a> | NoneBase

export const mkSomeBase = <a>(x: a): SomeBase<a> => ({ kind: 'some', value: x })

export const mkNoneBase = (): NoneBase => ({ kind: 'none' })

export interface MaybeFunctions<a> {
  map: <b>(f: Fun<a,b>) => Maybe<b>
  eq: (y: a) => boolean
  eqM: (y: Maybe<a>) => boolean
}

export type Some<a> = SomeBase<a> & MaybeFunctions<a>

export type None<a> = NoneBase & MaybeFunctions<a>

export type Maybe<a> = Some<a> | None<a>

const mkMaybeFromBase = <a>(m: MaybeBase<a>): Maybe<a> => ({
  ...m,
  map: function<b>(f: Fun<a,b>): Maybe<b> { return isSome(this) ? mkSome(f(this.value)) : mkNone() },
  eq: function(y: a): boolean { return isSome(this) ? this.value === y : false },
  eqM: function(y: Maybe<a>): boolean { return isSome(y) ? this.eq(y.value) : isNone(this) },
})

export const isSome = <a>(x: Maybe<a>): x is Some<a> => x.kind === 'some'

export const isNone = <a>(x: Maybe<a>): x is None<a> => x.kind === 'none'

export const mkNone = <a>(): Maybe<a> => mkMaybeFromBase(mkNoneBase())

export const mkSome = <a>(x: a): Maybe<a> => mkMaybeFromBase(mkSomeBase(x))

export const mkMaybe = <a>(x: a | undefined): Maybe<a> => x ? mkSome(x) : mkNone()
