import { TagsCollection, Project, ProjectsCollection } from "./types"
import { createQueryString } from "../lib/query"

export const qualifyResource = (s: string) => 'https://cmgt.hr.nl:8000/' + s

export const getTags = async (): Promise<string[]> => {
  try {
    const res = await fetch(qualifyResource('api/tags'))

    if (res.ok) {
      const data: TagsCollection = await res.json()
      return data.tags
    }

    throw new Error(`Error fetching tags: ${res.status}, ${res.statusText}\n${res.body}`)
  } catch(e) {
    throw new Error(`Error fetching tags: ${e}`)
  }
}

export const getProject = async (slug: string): Promise<Project> => {
  try {
    const res = await fetch(qualifyResource(`api/projects/${slug}`))

    if (res.ok) {
      const data: Project = await res.json()
      return data
    }

    throw new Error(`Error fetching project ${slug}: ${res.status}, ${res.statusText}\n${res.body}`)

  } catch(e) {
    throw new Error(`Error fetching project ${slug}: ${e}`)
  }
}

export const getProjects = async (options: {
  spotlight?: boolean
  limit?: number
  tag?: string
}): Promise<Project[]> => {
  try {
    const res = await fetch(qualifyResource(`api/projects${createQueryString(options)}`))

    if (res.ok) {
      const data: ProjectsCollection = await res.json()
      return data.projects
    }

    throw new Error(`Error fetching projects: ${res.status}, ${res.statusText}\n${res.body}`)

  } catch(e) {
    throw new Error(`Error fetching projects: ${e}`)
  }
}
