import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'src/content/posts')

const ok = (data: unknown) => NextResponse.json({ success: true, data, message: '' })
const err = (message: string, status = 400) => NextResponse.json({ success: false, data: null, message }, { status })

// GET /api/blog — 列出所有文章
export async function GET() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'))
  const posts = files.map(f => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8')
    const { data } = matter(raw)
    return { slug: f.replace('.mdx', ''), ...data }
  }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return ok(posts)
}

// POST /api/blog — 新建文章
export async function POST(req: NextRequest) {
  const { slug, title, date, tags, category, summary, published, content } = await req.json()
  if (!slug || !title || !content) return err('slug, title, content required')

  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  if (fs.existsSync(filePath)) return err('slug already exists')

  const frontmatter = matter.stringify('\n' + content, {
    title, date: date || new Date().toISOString().slice(0, 10),
    tags: tags || [], category: category || '', summary: summary || '', published: published ?? false,
  })
  fs.writeFileSync(filePath, frontmatter, 'utf-8')
  return ok({ slug })
}
