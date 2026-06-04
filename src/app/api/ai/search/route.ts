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
  if (!query) return NextResponse.json({ success: false, message: 'query required' }, { status: 400 })

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, title: true, summary: true, tags: true },
  })

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    max_tokens: 512,
    messages: [
      {
        role: 'system',
        content: `根据用户问题，从以下文章列表中推荐最相关的文章，返回 JSON 数组：[{"slug":"...","title":"...","reason":"..."}]，只返回 JSON。\n\n文章列表：${JSON.stringify(posts)}`,
      },
      { role: 'user', content: query },
    ],
  })

  const text = response.choices[0]?.message?.content ?? '[]'
  try {
    const slugMap = new Map(posts.map(p => [p.slug, p.title]))
    const raw: { slug: string; title?: string; reason: string }[] = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] ?? '[]')
    const results = raw.map(r => ({ ...r, title: r.title || slugMap.get(r.slug) || r.slug }))
    return NextResponse.json({ success: true, data: results, message: '' })
  } catch {
    return NextResponse.json({ success: true, data: [], message: '' })
  }
}
