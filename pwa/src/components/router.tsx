import { BrowserRouter, Switch, Route, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { Maybe, mkMaybe, isSome } from "../lib/maybe";


export interface AppRoute<k extends string, p extends { [k: string]: string }> {
  kind: k
  params: { [P in keyof p]: Maybe<p[P]> }
}

export type AppRoutes = AppRoute<'projects', { tag: string }> | AppRoute<'404', {}> | AppRoute<'projectDetail', { slug: string }>

const RouteToState = ({onRoute, route}: { onRoute: (r: AppRoutes) => void, route: Pick<AppRoutes, 'kind'> }) => {

  const params = useParams<{ slug?: string, tag?: string }>()

  useEffect(() => {
    if (route.kind === 'projectDetail') {
      onRoute({ kind: 'projectDetail', params: { slug: mkMaybe(params.slug) } })
    }

    if (route.kind === 'projects') {
      onRoute({ kind: 'projects', params: { tag: mkMaybe(params.tag) } })
    }

    if (route.kind === '404') {
      onRoute({ kind: '404', params: {}})
    }
  })

  return null
}

export const eqRoute = (a: AppRoutes, b: AppRoutes) => {
  if (a.kind !== b.kind) {
    return false
  }

  const paramsA = Object.entries(a.params)
  const paramsB = Object.entries(b.params)

  const paramsAreEqual = paramsA.every(([ka,va]) => {
    const pb = paramsB.find(([kb, vb]) => ka === kb)
    if (pb === undefined) return false
    const [kb, vb] = pb
    return va.eqM(vb)
  })
  return paramsAreEqual
}


export const Router = ({onRoute, children}: { onRoute: (r: AppRoutes) => void, children: React.ReactNode }) => (
  <BrowserRouter>
    { children }
    <Switch>
      <Route exact path="/" ><RouteToState route={{ kind: 'projects' }} onRoute={onRoute} /></Route>
      <Route path="/project/:slug" ><RouteToState route={{ kind: 'projectDetail' }} onRoute={onRoute} /></Route>
      <Route path="*" ><RouteToState route={{ kind: '404' }} onRoute={onRoute} /></Route>
    </Switch>
  </BrowserRouter>
)
