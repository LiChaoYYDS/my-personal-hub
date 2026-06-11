import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rateLimit'

const ALLOWED = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'application/zip', 'application/x-zip-compressed',
  'application/x-rar-compressed', 'application/x-7z-compressed',
  'application/gzip',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain', 'text/csv', 'text/markdown',
  'application/json',
  'application/octet-stream',
]
const MAX_SIZE = 50 * 1024 * 1024

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit('upload:' + ip, 10, 60_000)) {
    return NextResponse.json({ success: false, message: '上传过于频繁' }, { status: 429 })
  }

  const form = await req.formData()
  const file = form.get('file') as File | null

  if (!file) return NextResponse.json({ success: false, message: 'no file' }, { status: 400 })
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ success: false, message: '不支持的文件格式' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ success: false, message: '文件不能超过 50MB' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = buffer.toString('base64')
  const dataUrl = 'data:' + file.type + ';base64,' + base64

  const upload = await prisma.upload.create({
    data: { key: 'uploads/' + Date.now(), url: dataUrl, size: file.size, mimeType: file.type },
  })

  // 返回短 URL，通过 /api/uploads/[id] 代理访问文件
  const shortUrl = '/api/uploads/' + upload.id
  return NextResponse.json({ success: true, data: { ...upload, url: shortUrl }, message: '' })
}
