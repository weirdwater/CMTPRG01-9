import * as React from 'react'
import { Link, Route, useLocation } from 'react-router-dom'
import { Project } from './api/types'
import { Router, AppRoutes, eqRoute } from './components/router'
import { FilterPage } from './components/filter-page'
import { ProjectsOverviewPage, ProjectsOverviewPageState } from './components/projects-overview-page'
import { mkLoadedAsync, mkUnloadedAsync, isLoading, isUnloaded, mkErrorAsync } from './lib/async'
import { usePrevious } from './lib/hooks'
import { getTags, getProjects } from './api'
import { isSome } from './lib/maybe'

const sample: Project = {"_id":"5b12fbccbf2d6b420ee6f454","headerImage":"public/uploads/baa93acd-a2a3-4df8-84d4-1290fae94119.png","emailUploader":"e.katerborg@hr.nl","spotlight":true,"title":"Beavers Be Dammed","author":"bla","year":2017,"duration":"4 maanden","youtube":"f0_xZcLQplw","tagline":"Avoid those weapons of Dam Destruction","description":"In Beavers Be Dammed your objective is to steal wood from sawmills before the time runs out. to beavery specific, you and a beaver buddy gnaw your way into the mill, locate the timber and maneuver those heavy logs towards the drop-off point.   BEAWARE! This is a situation of life and death! You will be dodging sharp saw blades, avoid being cooked by feisty flamethrowers and more weapons of dam destruction.   Features: Local multiplayer, Unique co-op experience, Full controller support,   Easy to pick up, hard to master","slug":"beavers-be-dammed","__v":0,"dateUpdated":new Date("2018-06-02T20:19:24.657Z"),"dateCreated":new Date("2018-06-02T20:19:24.657Z"),"tags":["minor","games","jaar4"],"screenshots":["public/uploads/c86901ab-3704-4c91-955a-4711956a16b3.png","public/uploads/2382822d-f733-43a3-9eec-0e3cad32e5ad.png","public/uploads/f11a9d95-e3d2-4d98-a0d6-3ff9dda0457c.png","public/uploads/7d3a1b7a-4482-4588-88e1-9237f1e6f419.png"],"websites":["http://beaversbedammed.com/","http://store.steampowered.com/app/764570/Beavers_Be_Dammed"],"_links":{"self":{"href":"https://cmgt.hr.nl:8000/api/projects/5b12fbccbf2d6b420ee6f454"},"collection":{"href":"https://cmgt.hr.nl:8000/api/projects/"}}}

const sampleTags: string[] = [
  "jaar1",
  "jaar2",
  "jaar3",
  "jaar4",
  "unity",
  "games",
  "cle",
  "iot",
  "machine-learning",
  "react",
  "functional-programming",
  "fedex"
]

export interface AppState {
  route: AppRoutes
  overview: ProjectsOverviewPageState
}

export const App = () => {
  const [ s1, setState ] = React.useState<AppState>({
    route: { kind: '404', params: {} },
    overview: {
      tags: mkUnloadedAsync(),
      filterOpen: false,
      projects: mkUnloadedAsync(),
      spotlight: mkUnloadedAsync()
    }
  })

  const s0 = usePrevious<AppState>(s1)

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

  return (
    <Router onRoute={route => setState(s2 => !eqRoute(route, s2.route) ? ({...s2, route }) : s2)} >
      { s1.route.kind === 'projects' ?
        <ProjectsOverviewPage route={s1.route} state={s1.overview} onState={a => setState(s2 => ({...s2, overview: a(s2.overview)}))} />
      : s1.route.kind === 'projectDetail' && isSome(s1.route.params.slug) ?
        <div>Project {s1.route.params.slug.value}</div>
      : <div>not found</div> }
    </Router>
  )
}
