import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const contentDir = path.join(process.cwd(), 'src/content')

export interface PostFrontmatter {
  title: string
  date: string
  tags: string[]
  category: string
  summary: string
  published: boolean
}

export function getPostSlugs() {
  const dir = path.join(contentDir, 'posts')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))
}

export function getPostBySlug(slug: string) {
  const decoded = decodeURIComponent(slug)
  const file = fs.readFileSync(path.join(contentDir, 'posts', `${decoded}.mdx`), 'utf-8')
  const { data, content } = matter(file)
  return {
    slug: decoded,
    frontmatter: data as PostFrontmatter,
    content,
    readingTime: readingTime(content).text,
  }
}

export function getAllPosts() {
  return getPostSlugs()
    .map(f => getPostBySlug(f.replace('.mdx', '')))
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
}

export function extractHeadings(content: string) {
  const matches = content.matchAll(/^(#{1,4})\s+(.+)$/gm)
  return Array.from(matches).map(m => ({
    level: m[1].length,
    text: m[2].replace(/\*\*|__|\*|_|`/g, ''),
    id: m[2].toLowerCase().replace(/[^\w一-龥]+/g, '-').replace(/^-|-$/g, ''),
  }))
}

export function getProjectSlugs() {
  const dir = path.join(contentDir, 'projects')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))
}

export function getProjectBySlug(slug: string) {
  const file = fs.readFileSync(path.join(contentDir, 'projects', `${slug}.mdx`), 'utf-8')
  const { data, content } = matter(file)
  return { slug, frontmatter: data, content }
}

export function getAllProjects() {
  return getProjectSlugs().map(f => getProjectBySlug(f.replace('.mdx', '')))
}
