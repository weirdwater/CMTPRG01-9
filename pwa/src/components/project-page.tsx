import * as React from 'react'
import { PageHeader } from './page-header'
import { qualifyResource } from '../api'
import { Project } from '../api/types'
import { TagList } from './tag-list'
import { mkNone } from '../lib/maybe'
import { Time, User, Network } from '../icons'
import { ResponsiveImage } from './responsive-image'

export const ProjectPage = ({ project }: { project: Project }) => (
  <div>
    <PageHeader>
      <ResponsiveImage src={qualifyResource(project.headerImage)} ratio={0.57} />
      <h1>{project.title}</h1>
      <p>{project.tagline}</p>
      <TagList tags={project.tags} selected={mkNone()} />
      <div>
        <div><Time />{project.duration}, {project.year}</div>
        <div><User />{project.author}</div>
      </div>
    </PageHeader>
    <p>{project.description}</p>
    <div>Youtube: {project.youtube}</div>
    <div>
      {project.screenshots.map(s => <ResponsiveImage src={qualifyResource(s)} ratio={0.91} />)}
    </div>
    <div>
      <h2>Links</h2>
      <ul>
        {project.websites.map(url => <li><a href={url} target="_blank" ><Network/>{url}</a></li>)}
      </ul>
    </div>
  </div>
)
