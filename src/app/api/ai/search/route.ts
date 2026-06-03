import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getAllPosts } from '@/lib/mdx'
import { rateLimit } from '@/lib/rateLimit'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`search:${ip}`, 30, 60_000)) {
    return NextResponse.json({ success: false, message: 'Too Many Requests' }, { status: 429 })
  }

  const { query } = await req.json()
  if (!query) return NextResponse.json({ success: false, message: 'query required' }, { status: 400 })

  const posts = getAllPosts().filter(p => p.frontmatter.published).map(p => ({
    slug: p.slug,
    title: p.frontmatter.title,
    summary: p.frontmatter.summary,
    tags: p.frontmatter.tags,
  }))

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 512,
    system: `根据用户问题，从以下文章列表中推荐最相关的文章，返回 JSON 数组：[{"slug":"...","title":"...","reason":"..."}]

文章列表：
${JSON.stringify(posts)}`,
    messages: [{ role: 'user', content: query }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '[]'
  try {
    const raw: { slug: string; title?: string; reason: string }[] = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] ?? '[]')
    // 用本地数据补全 title，防止 AI 返回错误
    const slugMap = new Map(posts.map(p => [p.slug, p.title]))
    const results = raw.map(r => ({ ...r, title: r.title || slugMap.get(r.slug) || r.slug }))
    return NextResponse.json({ success: true, data: results, message: '' })
  } catch {
    return NextResponse.json({ success: true, data: [], message: '' })
  }
}
