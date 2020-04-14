import * as React from 'react'
import { Link, Route, useLocation } from 'react-router-dom'
import { Project } from './api/types'
import { Router, AppRoutes, eqRoute } from './components/router'
import { FilterPage } from './components/filter-page'
import { ProjectsOverviewPage, ProjectsOverviewPageState, recoverOverviewState } from './components/projects-overview-page'
import { mkLoadedAsync, mkUnloadedAsync, isLoading, isUnloaded, mkErrorAsync, AsyncState, isLoaded, isError } from './lib/async'
import { usePrevious } from './lib/hooks'
import { getTags, getProjects, getProject } from './api'
import { isSome } from './lib/maybe'
import { ProjectPage } from './components/project-page'
import { PageHeader } from './components/page-header'
import useEventListener from '@use-it/event-listener'
import { OfflineNotice } from './components/offline-notice'
import { Content } from './components/content'

export interface AppState {
  route: AppRoutes
  online: boolean
  overview: ProjectsOverviewPageState
  project: AsyncState<Project>
}

export const App = () => {
  const [ s1, setState ] = React.useState<AppState>({
    route: { kind: '404', params: {} },
    online: window.navigator.onLine,
    overview: {
      tags: mkUnloadedAsync(),
      filterOpen: false,
      projects: mkUnloadedAsync(),
      spotlight: mkUnloadedAsync()
    },
    project: mkUnloadedAsync()
  })

  const s0 = usePrevious<AppState>(s1)

  useEventListener('online', () => setState(s2 => ({...s2, online: true, overview: recoverOverviewState(s2.overview), project: isError(s2.project) ? mkUnloadedAsync() : s2.project })))
  useEventListener('offline', () => setState(s2 => ({...s2, online: false })))

  if (s0 && isLoading(s1.overview.tags) && !isLoading(s0.overview.tags)) {
    getTags()
      .then(t => setState(s2 => ({...s2, overview: {...s2.overview, tags: mkLoadedAsync(t)}})))
      .catch(e => setState(s2 => ({...s2, overview: {...s2.overview, tags: mkErrorAsync(e)}})))
  }

  if (s0 && isLoading(s1.overview.projects) && !isLoading(s0.overview.projects)) {
    getProjects({ tag: s1.route.kind === 'projects' && isSome(s1.route.params.tag) ? s1.route.params.tag.value : undefined })
      .then(p => setState(s2 => ({...s2, overview: {...s2.overview, projects: mkLoadedAsync(p)}})))
      .catch(e => setState(s2 => ({...s2, overview: {...s2.overview, projects: mkErrorAsync(e)}})))
  }

  if (s0 && isLoading(s1.overview.spotlight) && !isLoading(s0.overview.spotlight)) {
    getProjects({ limit: 1, spotlight: true })
      .then(p => setState(s2 => ({...s2, overview: {...s2.overview, spotlight: mkLoadedAsync(p[0])}})))
      .catch(e => setState(s2 => ({...s2, overview: {...s2.overview, spotlight: mkErrorAsync(e)}})))
  }

  if (s0 && isLoading(s1.project) && !isLoading(s0.project) && s1.route.kind === 'projectDetail' && isSome(s1.route.params.slug)) {
    getProject(s1.route.params.slug.value)
      .then(p => setState(s2 => ({...s2, project: mkLoadedAsync(p)})))
      .catch(e => setState(s2 => ({...s2, project: mkErrorAsync(e)})))
  }

  return (
    <Router onRoute={route => setState(s2 => !eqRoute(route, s2.route) ? ({...s2, route }) : s2)} >
      { s1.route.kind === 'projects' ?
        <ProjectsOverviewPage online={s1.online} route={s1.route} state={s1.overview} onState={a => setState(s2 => ({...s2, overview: a(s2.overview)}))} />
      : s1.route.kind === 'projectDetail' && isSome(s1.route.params.slug) ?
        <ProjectPage online={s1.online} project={s1.project} onState={a => setState(s2 => ({...s2, project: a(s2.project)}))} />
      : <div>
        <PageHeader>
        </PageHeader>
          <OfflineNotice online={s1.online} />
          <Content>
            <h1>So sorry,</h1>
            <p>We could not find the page you are looking for.</p>
          </Content>
        </div>
      }
    </Router>
  )
}
