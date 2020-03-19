import * as React from 'react'
import { Project } from '../api/types'
import { qualifyResource } from '../api'
import * as styles from '../style/components/project-teaser.scss'
import { ResponsiveImage } from './responsive-image'

export const ProjectTeaser = ({ project, size }: {
  project: Project
  size: 'small' | 'large'
}) => (
  <article className={[styles.teaser, styles[size]].join(' ')} >
    <div className={styles.imageWrapper} >
      <ResponsiveImage src={qualifyResource(project.headerImage)} ratio={size === 'small' ? .79 : .53} />
    </div>
    <div className={styles.textWrapper} >
      <ul className={styles.tags} >
        { project.tags.map(t => <li key={t} >{t}</li>) }
        { size === 'large' && <li className={styles.year} >{project.year}</li> }
      </ul>
      <h1 className={styles.title} >{project.title}</h1>
      <p className={styles.tagline} >{project.tagline}</p>
    </div>
  </article>
)
