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

function makeId(text: string) {
  return text.trim().toLowerCase().replace(/[^\w一-龥]+/g, '-').replace(/^-|-$/g, '')
}

export function extractHeadings(content: string) {
  const result: { level: number; text: string; id: string }[] = []
  for (const line of content.split('\n')) {
    const t = line.trim()
    // 标准 markdown 标题
    const md = t.match(/^(#{1,4})\s+(.+)$/)
    if (md) {
      const text = md[2].trim().replace(/\*\*|__|\*|_|`/g, '')
      result.push({ level: md[1].length, text, id: makeId(text) })
      continue
    }
    // 数字格式标题：1. xxx 或 1.1 xxx（排除纯数字行）
    const h2 = t.match(/^(\d+)\.\s+([^\d].+)$/)
    if (h2) { result.push({ level: 2, text: h2[2].trim(), id: makeId(h2[2]) }); continue }
    const h3 = t.match(/^(\d+)\.(\d+)\s+(.+)$/)
    if (h3) { result.push({ level: 3, text: h3[3].trim(), id: makeId(h3[3]) }); continue }
  }
  return result
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
