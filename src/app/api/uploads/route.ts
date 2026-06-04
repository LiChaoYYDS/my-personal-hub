import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rateLimit'
import { nanoid } from 'nanoid'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`upload:${ip}`, 10, 60_000)) {
    return NextResponse.json({ success: false, message: '上传过于频繁' }, { status: 429 })
  }

  const form = await req.formData()
  const file = form.get('file') as File | null

  if (!file) return NextResponse.json({ success: false, message: 'no file' }, { status: 400 })
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ success: false, message: '不支持的图片格式' }, { status: 400 })
  if (file.size > MAX_SIZE) return NextResponse.json({ success: false, message: '图片不能超过 5MB' }, { status: 400 })

  // 转为 base64 data URL，直接存数据库，无需外部存储服务
  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = buffer.toString('base64')
  const url = `data:${file.type};base64,${base64}`

  const key = `uploads/${nanoid()}`
  const upload = await prisma.upload.create({
    data: { key, url, size: file.size, mimeType: file.type },
  })

  return NextResponse.json({ success: true, data: { ...upload, url }, message: '' })
}
