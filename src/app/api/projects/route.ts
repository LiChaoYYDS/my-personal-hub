// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ok = (data: unknown) => NextResponse.json({ success: true, data, message: '' })
const err = (message: string, status = 400) => NextResponse.json({ success: false, data: null, message }, { status })

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
    return ok(projects)
  } catch (e) {
    return err('Failed to fetch projects', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { slug, title, description, tech, github, demo, published, content, attachments, year, group, icon } = await req.json()
    if (!slug || !title) return err('slug and title required')

    const existing = await prisma.project.findUnique({ where: { slug } })
    if (existing) return err('slug already exists')

    const project = await prisma.project.create({
      data: {
        slug, title, description: description ?? '',
        content: content ?? '',
        tech: tech ?? [],
        github: github ?? '', demo: demo ?? '',
        published: published ?? false,
        year: year ?? '', groupText: group ?? '其他', icon: icon ?? '',
        attachments: JSON.stringify(attachments ?? []),
      },
    })
    return ok(project)
  } catch (e: any) {
    return err(e?.message ?? 'create failed', 500)
  }
}
