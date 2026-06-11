import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { prisma } from '@/lib/prisma'
import type { ProjectFrontmatter } from '@/types'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug)
  const p = await prisma.project.findUnique({ where: { slug } })
  if (!p) return {}
  return { title: p.title, description: p.description }
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug)
  const p = await prisma.project.findUnique({ where: { slug } })
  if (!p) notFound()

  return (
    <Container className="py-16 space-y-10">
      <header className="space-y-4 pb-8 border-b border-border">
        <h1 className="text-3xl font-semibold tracking-tight">{p.title}</h1>
        <p className="text-secondary text-sm leading-relaxed">{p.description}</p>
        <div className="flex flex-wrap gap-2">
          {p.tech?.map(t => (
            <span key={t} className="text-xs text-muted border border-border rounded-sm px-2 py-0.5">{t}</span>
          ))}
        </div>
        <div className="flex gap-4 pt-1">
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer"
              className="text-sm text-secondary hover:text-accent transition-colors">GitHub →</a>
          )}
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noopener noreferrer"
              className="text-sm text-secondary hover:text-accent transition-colors">在线预览 →</a>
          )}
        </div>
      </header>

      {p.content?.trim() && (
        <div className="article-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {p.content}
          </ReactMarkdown>
        </div>
      )}
    </Container>
  )
}
