import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ok = (data: unknown) => NextResponse.json({ success: true, data, message: '' })
const err = (message: string, status = 400) => NextResponse.json({ success: false, data: null, message }, { status })

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const record = await prisma.lifeRecord.findUnique({ where: { id: params.id } })
  if (!record) return err('not found', 404)
  await prisma.lifeRecord.delete({ where: { id: params.id } })
  return ok(null)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const record = await prisma.lifeRecord.findUnique({ where: { id: params.id } })
  if (!record) return err('not found', 404)
  const { content, images, location, mood } = await req.json()
  const updated = await prisma.lifeRecord.update({
    where: { id: params.id },
    data: { content, images, location, mood },
  })
  return ok(updated)
}
