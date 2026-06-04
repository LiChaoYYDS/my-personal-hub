import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rateLimit'

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`search:${ip}`, 30, 60_000)) {
    return NextResponse.json({ success: false, message: 'Too Many Requests' }, { status: 429 })
  }

  const { query } = await req.json()
  if (!query?.trim()) return NextResponse.json({ success: false, message: 'query required' }, { status: 400 })

  const q = query.trim()

  // 第一步：数据库模糊匹配
  const dbPosts = await prisma.blogPost.findMany({
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
    select: { slug: true, title: true, summary: true },
    take: 10,
  })

  if (dbPosts.length > 0) {
    return NextResponse.json({
      success: true,
      data: dbPosts.map(p => ({ slug: p.slug, title: p.title, reason: p.summary || '站内文章', source: 'db' })),
      message: '',
    })
  }

  // 第二步：数据库无结果，让 AI 联网搜索
  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: '你是一个搜索助手。用户在博客站内找不到相关文章，请根据用户的问题，从互联网上找3-5条相关资料，以 JSON 数组返回：[{"title":"...","url":"...","reason":"一句话说明相关性"}]，只返回 JSON，不要其他内容。',
        },
        { role: 'user', content: q },
      ],
    })

    const text = response.choices[0]?.message?.content ?? '[]'
    const raw: { title: string; url: string; reason: string }[] = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] ?? '[]')

    return NextResponse.json({
      success: true,
      data: raw.map(r => ({ title: r.title, url: r.url, reason: r.reason, source: 'web' })),
      message: '站内无结果，以下为网络搜索结果',
    })
  } catch {
    return NextResponse.json({ success: true, data: [], message: '未找到相关内容' })
  }
}
