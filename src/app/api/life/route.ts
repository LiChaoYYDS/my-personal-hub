// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ok = (data: unknown) => NextResponse.json({ success: true, data, message: '' })
const err = (message: string, status = 400) => NextResponse.json({ success: false, data: null, message }, { status })

export async function GET(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get('page') ?? 1)
  const take = 20
  const records = await prisma.lifeRecord.findMany({
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * take,
    take,
  })
  return ok(records)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { content, images = [], location, mood } = body
  if (!content?.trim()) return err('content is required')
  const record = await prisma.lifeRecord.create({
    data: { content, images, location, mood },
  })
  return ok(record)
}
