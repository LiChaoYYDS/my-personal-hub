import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`search:${ip}`, 60, 60_000)) {
    return NextResponse.json({ success: false, message: 'Too Many Requests' }, { status: 429 })
  }

  const { query } = await req.json()
  if (!query?.trim()) return NextResponse.json({ success: false, message: 'query required' }, { status: 400 })

  const q = query.trim()

  // 多字段模糊匹配：标题、摘要、内容、标签
  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
        { category: { contains: q, mode: 'insensitive' } },
      ],
    },
    orderBy: { date: 'desc' },
    select: { slug: true, title: true, summary: true, date: true },
    take: 10,
  })

  const results = posts.map(p => ({
    slug: p.slug,
    title: p.title,
    reason: p.summary || '点击查看详情',
  }))

  return NextResponse.json({ success: true, data: results, message: '' })
}
