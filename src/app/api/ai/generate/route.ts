import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { rateLimit } from '@/lib/rateLimit'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`generate:${ip}`, 10, 60_000)) {
    return NextResponse.json({ success: false, message: 'Too Many Requests' }, { status: 429 })
  }

  const { title, content } = await req.json()
  if (!title || !content) {
    return NextResponse.json({ success: false, message: 'title and content required' }, { status: 400 })
  }

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 256,
    system: '你是一个博客助手。根据文章标题和内容，返回 JSON：{"summary":"一句话摘要，不超过80字","tags":["标签1","标签2","标签3"]}，只返回 JSON，不要其他内容。',
    messages: [{ role: 'user', content: `标题：${title}\n\n内容：${content.slice(0, 2000)}` }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  try {
    const result = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? '{}')
    return NextResponse.json({ success: true, data: result, message: '' })
  } catch {
    return NextResponse.json({ success: false, message: 'parse error' }, { status: 500 })
  }
}
