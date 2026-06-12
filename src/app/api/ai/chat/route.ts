// @ts-nocheck
import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { getAllPosts } from '@/lib/mdx'
import { rateLimit } from '@/lib/rateLimit'

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
})

const ABOUT = `你是这个个人网站的 AI 助手，代表站长与访客交流。
站长是一名 AI 工程师，专注于 AI 系统、全栈开发和产品设计。
请用友好、简洁的语气回答，回答限制在 200 字以内。
如果问到文章内容，根据下方文章列表推荐相关文章。`

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`chat:${ip}`, 20, 60_000)) {
    return new Response('Too Many Requests', { status: 429 })
  }

  const { messages } = await req.json()

  const posts = getAllPosts()
    .filter(p => p.frontmatter.published)
    .map(p => `- [${p.frontmatter.title}](/blog/${p.slug}): ${p.frontmatter.summary}`)
    .join('\n')

  const stream = await client.chat.completions.create({
    model: 'deepseek-v4-pro',
    max_tokens: 512,
    messages: [
      { role: 'system', content: `${ABOUT}\n\n文章列表：\n${posts}` },
      ...messages,
    ],
    stream: true,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content
        if (text) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  })
}
