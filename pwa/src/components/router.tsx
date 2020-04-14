import { BrowserRouter, Switch, Route, useParams } from "react-router-dom";
import React from "react";
import { Maybe, mkMaybe } from "../lib/maybe";


interface AppRoute<k extends string, p extends { [k: string]: string }> {
  kind: k
  params: { [P in keyof p]: Maybe<p[P]> }
}

type AppRoutes = AppRoute<'projects', { tag: string }> | AppRoute<'404', {}> | AppRoute<'projectDetail', { slug: string }>

const RouteToState = ({onRoute, route}: { onRoute: (r: AppRoutes) => void, route: Pick<AppRoutes, 'kind'> }) => {

  const params = useParams<{ slug?: string, tag?: string }>()

  if (route.kind === 'projectDetail') {
    onRoute({ kind: 'projectDetail', params: { slug: mkMaybe(params.slug) } })
  }

  if (route.kind === 'projects') {
    onRoute({ kind: 'projects', params: { tag: mkMaybe(params.tag) } })
  }

  if (route.kind === '404') {
    onRoute({ kind: '404', params: {}})
  }

  return null
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
