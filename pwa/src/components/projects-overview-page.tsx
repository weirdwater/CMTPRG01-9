import * as React from 'react'
import { FilterPage } from './filter-page'
import { PageHeader } from './page-header'
import { ProjectTeaser } from './project-teaser'
import { OfflineNotice } from './offline-notice'
import { mkNone } from '../lib/maybe'
import { AsyncState, isLoaded } from '../lib/async'
import { AppRoutes, ProjectsOverviewRoute } from './router'
import { Project } from '../api/types'
import { Action } from '../lib/fun'

export interface ProjectsOverviewPageState {
  filterOpen: boolean,
  projects: AsyncState<Project[]>
  spotlight: AsyncState<Project>
  tags: AsyncState<string[]>
}

export const ProjectsOverviewPage = ({
  state,
  route,
  onState
}: {
  state: ProjectsOverviewPageState,
  onState: (a: Action<ProjectsOverviewPageState>) => void
  route: ProjectsOverviewRoute
}): JSX.Element => (
  <FilterPage tags={state.tags} open={state.filterOpen} selected={route.params.tag} onToggleTray={() => onState(s1 => ({...s1, filterOpen: !s1.filterOpen}))} >
    <PageHeader>
      {/* { isLoaded(state.spotlight) ? <ProjectTeaser project={state.spotlight.value} size="large" /> : <div>Loading...</div> } */}
    </PageHeader>
    { isLoaded(state.projects) ? state.projects.value.map(p => <ProjectTeaser project={p} size="small" />) : <div>Loading...</div> }
  </FilterPage>
)