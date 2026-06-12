import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ok = (data: unknown) => NextResponse.json({ success: true, data, message: '' })
const err = (message: string, status = 400) => NextResponse.json({ success: false, data: null, message }, { status })

// GET /api/blog — 列出所有文章（按日期倒序）
export async function GET() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { date: 'desc' },
    select: { slug: true, title: true, date: true, tags: true, category: true, summary: true, published: true },
  })
  return ok(posts)
}

// POST /api/blog — 新建文章
export async function POST(req: NextRequest) {
  const { slug, title, date, tags, category, summary, published, content } = await req.json()
  if (!slug || !title || !content) return err('slug, title, content required')

  const existing = await prisma.blogPost.findUnique({ where: { slug } })
  if (existing) return err('slug already exists')

  const post = await prisma.blogPost.create({
    data: {
      slug,
      title,
      content,
      tags: tags || [],
      category: category || '',
      summary: summary || '',
      published: published ?? false,
      date: date ? new Date(date) : new Date(),
      updatedAt: new Date(),
    },
  })

  return ok({ slug: post.slug })
}
