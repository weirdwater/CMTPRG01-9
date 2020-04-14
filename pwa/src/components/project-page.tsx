import * as React from 'react'
import { PageHeader } from './page-header'
import { qualifyResource } from '../api'
import { Project } from '../api/types'
import { TagList } from './tag-list'
import { mkNone, Maybe, mkSome, isSome } from '../lib/maybe'
import { Time, User, Network } from '../icons'
import { ResponsiveImage } from './responsive-image'
import styles from '../style/components/project-page.scss'
import YouTube from 'react-youtube'


const sanitizeYoutube = (x: string): Maybe<string> => {
  if (!x) {
    return mkNone()
  }

  const shortUrl = x.match(/^https?:\/\/youtu\.be\/([\w\d-_]+)/)
  if (shortUrl) {
    return mkSome(shortUrl[1])
  }

  const longUrl = x.match(/(\?|&)v=([\w\d-_]+)&?/)
  if (longUrl) {
    return mkSome(longUrl[2])
  }

  if (x.length > 10) {
    return mkSome(x)
  }

  return mkNone()
}

export const ProjectPage = ({ project }: { project: Project }) => {
  const youtubeId = sanitizeYoutube(project.youtube)
  return (
    <div>
      <PageHeader>
        <div className={styles.heroImage} >
          <ResponsiveImage src={qualifyResource(project.headerImage)} ratio={0.57} />
        </div>
        <div className={styles.header} >
          <h1>{project.title}</h1>
          <p>{project.tagline}</p>
          <TagList tags={project.tags} selected={mkNone()} onChange={() => {}} />
        </div>
        <div className={styles.metadata} >
          <div><Time className={styles.icon} />{project.duration}, {project.year}</div>
          <div><User className={styles.icon} />{project.author}</div>
        </div>
      </PageHeader>
      <p className={styles.description} >{project.description}</p>
      { isSome(youtubeId) && <YouTube videoId={youtubeId.value} containerClassName={styles.youtube} /> }
      <div className={styles.galleryWrapper}>
        <div className={styles.gallery} >
          {project.screenshots.map((s, i) => <div key={i} className={styles.galleryImage} ><ResponsiveImage src={qualifyResource(s)} ratio={0.91} /></div>)}
        </div>
      </div>
      <div className={styles.linksWrapper} >
        <h2>Links</h2>
        <ul className={styles.links} >
          {project.websites.map((url, i) => (
            <li key={i}>
              <Network className={styles.icon} />
              <a href={url} target="_blank" >{url}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}