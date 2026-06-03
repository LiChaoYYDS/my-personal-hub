import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const PROJECTS_DIR = path.join(process.cwd(), 'src/content/projects')

const ok = (data: unknown) => NextResponse.json({ success: true, data, message: '' })
const err = (message: string, status = 400) => NextResponse.json({ success: false, data: null, message }, { status })

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const filePath = path.join(PROJECTS_DIR, `${params.slug}.mdx`)
  if (!fs.existsSync(filePath)) return err('not found', 404)
  const { data, content } = matter(fs.readFileSync(filePath, 'utf-8'))
  return ok({ slug: params.slug, frontmatter: data, content })
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const filePath = path.join(PROJECTS_DIR, `${params.slug}.mdx`)
  if (!fs.existsSync(filePath)) return err('not found', 404)
  const { title, description, tech, github, demo, published, content, attachments } = await req.json()
  fs.writeFileSync(filePath, matter.stringify('\n' + (content ?? ''), {
    title, description: description ?? '', tech: tech ?? [],
    github: github ?? '', demo: demo ?? '', published: published ?? false,
    attachments: attachments ?? [],
  }), 'utf-8')
  return ok({ slug: params.slug })
}

export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  const filePath = path.join(PROJECTS_DIR, `${params.slug}.mdx`)
  if (!fs.existsSync(filePath)) return err('not found', 404)
  fs.unlinkSync(filePath)
  return ok(null)
}
