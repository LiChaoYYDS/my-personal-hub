import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/uploads/[id] — 代理返回图片，url 以 data:... 形式存储
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const upload = await prisma.upload.findUnique({ where: { id: params.id } })
  if (!upload) return new NextResponse('Not found', { status: 404 })

  // url 是 data:image/...;base64,xxxx
  const match = upload.url.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) return NextResponse.redirect(upload.url)

  const buffer = Buffer.from(match[2], 'base64')
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': match[1],
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
