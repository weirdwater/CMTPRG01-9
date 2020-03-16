
export interface Link {
  href: string
}

export type PaginationLink = {
  page: number
} & Link

export interface Pagination {
  currentPage: number
  limit: number
  totalPages: number
  totalItems: number
  links: {
    first: PaginationLink
    last: PaginationLink
    previous: PaginationLink
    next: PaginationLink
  }
}

export interface Project {
  _id: string
  headerImage: string
  emailUploader: string
  spotlight: boolean
  title: string
  tagline: string
  author: string
  year: number
  description: string
  duration: string
  youtube: string
  slug: string
  __v: 0
  dateUpdated: Date
  dateCreated: Date
  tags: string[]
  screenshots: string[]
  websites: string[]
  _links: {
    self: Link
    collection: Link
  }
}

export interface ProjectsCollection {
  projects: Project[]
  links: {
    self: Link
  }
  pagination: Pagination
}

export interface TagsCollection {
  tags: string[]
}