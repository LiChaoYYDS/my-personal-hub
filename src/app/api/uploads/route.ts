import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/storage'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rateLimit'
import { nanoid } from 'nanoid'

const ALLOWED = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf', 'application/zip', 'application/x-zip-compressed',
  'text/plain', 'application/octet-stream',
]
const MAX_SIZE = 50 * 1024 * 1024

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`upload:${ip}`, 10, 60_000)) {
    return NextResponse.json({ success: false, message: '上传过于频繁，请稍后再试' }, { status: 429 })
  }

  const form = await req.formData()
  const file = form.get('file') as File | null

  if (!file) return NextResponse.json({ success: false, message: 'no file' }, { status: 400 })
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ success: false, message: 'invalid type' }, { status: 400 })
  if (file.size > MAX_SIZE) return NextResponse.json({ success: false, message: 'file too large' }, { status: 400 })

  try {
    const ext = file.name.split('.').pop()
    const key = `uploads/${nanoid()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadFile(key, buffer, file.type)

    const upload = await prisma.upload.create({
      data: { key, url, size: file.size, mimeType: file.type },
    })

    return NextResponse.json({ success: true, data: upload, message: '' })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message ?? '上传失败，请检查存储服务是否运行' }, { status: 500 })
  }
}
