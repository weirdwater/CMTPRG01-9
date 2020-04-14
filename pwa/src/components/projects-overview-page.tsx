import * as React from 'react'
import { FilterPage } from './filter-page'
import { PageHeader } from './page-header'
import { ProjectTeaser } from './project-teaser'
import { OfflineNotice } from './offline-notice'
import { mkNone, isNone } from '../lib/maybe'
import { AsyncState, isLoaded, isUnloaded, mkLoadingAsync } from '../lib/async'
import { AppRoutes, ProjectsOverviewRoute } from './router'
import { Project } from '../api/types'
import { Action } from '../lib/fun'
import { useHistory } from 'react-router-dom'

export interface ProjectsOverviewPageState {
  filterOpen: boolean,
  projects: AsyncState<Project[]>
  spotlight: AsyncState<Project>
  tags: AsyncState<string[]>
}

const setupAsyncStates: Action<ProjectsOverviewPageState> = (s0: ProjectsOverviewPageState) =>
    isUnloaded(s0.tags) ? setupAsyncStates({...s0, tags: mkLoadingAsync()})
  : isUnloaded(s0.spotlight) ? setupAsyncStates({...s0, spotlight: mkLoadingAsync()})
  : isUnloaded(s0.projects) ? setupAsyncStates({...s0,projects: mkLoadingAsync()})
  : s0

export const ProjectsOverviewPage = ({
  state,
  route,
  onState
}: {
  state: ProjectsOverviewPageState,
  onState: (a: Action<ProjectsOverviewPageState>) => void
  route: ProjectsOverviewRoute
}): JSX.Element => {
  const history = useHistory()

  return (
    <FilterPage
      tags={state.tags}
      open={state.filterOpen}
      selected={route.params.tag}
      onToggleTray={() => onState(s1 => ({...s1, filterOpen: !s1.filterOpen}))}
      onChange={t => isNone(t) ? history.push('/') : history.push('/?' + t.value) }>
      <PageHeader>
        {/* { isLoaded(state.spotlight) ? <ProjectTeaser project={state.spotlight.value} size="large" /> : <div>Loading...</div> } */}
      </PageHeader>
      { isLoaded(state.projects) ? state.projects.value.map(p => <ProjectTeaser project={p} size="small" />) : <div>Loading...</div> }
    </FilterPage>
  )
}