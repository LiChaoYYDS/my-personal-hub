import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'src/content/posts')

const ok = (data: unknown) => NextResponse.json({ success: true, data, message: '' })
const err = (message: string, status = 400) => NextResponse.json({ success: false, data: null, message }, { status })

// GET /api/blog/[slug] — 读取单篇文章
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const filePath = path.join(POSTS_DIR, `${params.slug}.mdx`)
  if (!fs.existsSync(filePath)) return err('not found', 404)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return ok({ slug: params.slug, frontmatter: data, content })
}

// PUT /api/blog/[slug] — 更新文章
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const filePath = path.join(POSTS_DIR, `${params.slug}.mdx`)
  if (!fs.existsSync(filePath)) return err('not found', 404)
  const { title, date, tags, category, summary, published, content } = await req.json()
  const updated = matter.stringify('\n' + (content ?? ''), {
    title, date, tags: tags || [], category: category || '',
    summary: summary || '', published: published ?? false,
  })
  fs.writeFileSync(filePath, updated, 'utf-8')
  return ok({ slug: params.slug })
}

// DELETE /api/blog/[slug] — 删除文章
export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  const filePath = path.join(POSTS_DIR, `${params.slug}.mdx`)
  if (!fs.existsSync(filePath)) return err('not found', 404)
  fs.unlinkSync(filePath)
  return ok(null)
}
