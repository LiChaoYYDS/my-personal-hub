export interface PostFrontmatter {
  title: string
  date: string
  tags: string[]
  category: string
  summary: string
  published: boolean
}

export interface ProjectFrontmatter {
  title: string
  description: string
  tech: string[]
  github?: string
  demo?: string
  published?: boolean
  year?: string
  group?: string
  icon?: string
  attachments?: { name: string; url: string; size: number }[]
}

export interface LifeRecord {
  id: string
  content: string
  images: string[]
  location?: string | null
  mood?: string | null
  createdAt: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message: string
}
