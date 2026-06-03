import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const PROJECTS_DIR = path.join(process.cwd(), 'src/content/projects')

const ok = (data: unknown) => NextResponse.json({ success: true, data, message: '' })
const err = (message: string, status = 400) => NextResponse.json({ success: false, data: null, message }, { status })

export async function GET() {
  if (!fs.existsSync(PROJECTS_DIR)) return ok([])
  const files = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.mdx'))
  const projects = files.map(f => {
    const { data } = matter(fs.readFileSync(path.join(PROJECTS_DIR, f), 'utf-8'))
    return { slug: f.replace('.mdx', ''), ...data }
  })
  return ok(projects)
}

export async function POST(req: NextRequest) {
  const { slug, title, description, tech, github, demo, published, content, attachments } = await req.json()
  if (!slug || !title) return err('slug and title required')
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`)
  if (fs.existsSync(filePath)) return err('slug already exists')
  fs.mkdirSync(PROJECTS_DIR, { recursive: true })
  fs.writeFileSync(filePath, matter.stringify('\n' + (content ?? ''), {
    title, description: description ?? '', tech: tech ?? [],
    github: github ?? '', demo: demo ?? '', published: published ?? false,
    attachments: attachments ?? [],
  }), 'utf-8')
  return ok({ slug })
}
