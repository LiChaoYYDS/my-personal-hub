import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ok = (data: unknown) => NextResponse.json({ success: true, data, message: '' })
const err = (message: string, status = 400) => NextResponse.json({ success: false, data: null, message }, { status })

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const project = await prisma.project.findUnique({ where: { slug: params.slug } })
    if (!project) return err('not found', 404)
    return ok(project)
  } catch (e) {
    return err('Failed to fetch project', 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await req.json()
    const data: Record<string, unknown> = {}
    if (body.title !== undefined) data.title = body.title
    if (body.description !== undefined) data.description = body.description
    if (body.content !== undefined) data.content = body.content
    if (body.tech !== undefined) data.tech = body.tech
    if (body.github !== undefined) data.github = body.github
    if (body.demo !== undefined) data.demo = body.demo
    if (body.published !== undefined) data.published = body.published
    if (body.year !== undefined) data.year = body.year
    if (body.group !== undefined) data.groupText = body.group
    if (body.icon !== undefined) data.icon = body.icon
    if (body.attachments !== undefined) data.attachments = JSON.stringify(body.attachments)
    const project = await prisma.project.update({ where: { slug: params.slug }, data })
    return ok(project)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'update failed'
    return err(msg, 500)
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await prisma.project.delete({ where: { slug: params.slug } })
    return ok({ deleted: true })
  } catch (e) {
    return err('not found', 404)
  }
}
