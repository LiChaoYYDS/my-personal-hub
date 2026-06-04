import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ok = (data: unknown) => NextResponse.json({ success: true, data, message: '' })
const err = (message: string, status = 400) => NextResponse.json({ success: false, data: null, message }, { status })

// GET /api/blog/[slug] — 读取单篇文章
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
  if (!post) return err('not found', 404)
  return ok({ slug: post.slug, frontmatter: post, content: post.content })
}

// PUT /api/blog/[slug] — 更新文章
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const existing = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
  if (!existing) return err('not found', 404)

  const { title, date, tags, category, summary, published, content } = await req.json()

  const post = await prisma.blogPost.update({
    where: { slug: params.slug },
    data: {
      title: title ?? existing.title,
      content: content ?? existing.content,
      tags: tags ?? existing.tags,
      category: category ?? existing.category,
      summary: summary ?? existing.summary,
      published: published ?? existing.published,
      date: date ? new Date(date) : existing.date,
    },
  })

  return ok({ slug: post.slug })
}

// DELETE /api/blog/[slug] — 删除文章
export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  await prisma.blogPost.delete({ where: { slug: params.slug } })
  return ok(null)
}
