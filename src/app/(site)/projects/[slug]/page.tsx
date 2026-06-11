import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { mdxComponents } from '@/features/blog/mdxComponents'
import { prisma } from '@/lib/prisma'
import type { ProjectFrontmatter } from '@/types'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug)
  const p = await prisma.project.findUnique({ where: { slug } })
  if (!p) return {}
  return { title: p.title, description: p.description }
}

async function renderContent(content: string) {
  try {
    return <MDXRemote source={content} components={mdxComponents} />
  } catch {
    // MDX 解析失败时，降级为纯文本显示
    return <pre className="whitespace-pre-wrap text-sm text-secondary leading-relaxed">{content}</pre>
  }
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug)
  const p = await prisma.project.findUnique({ where: { slug } })
  if (!p) notFound()

  const fm: ProjectFrontmatter = {
    title: p!.title,
    description: p!.description,
    tech: p!.tech,
    github: p!.github,
    demo: p!.demo,
    published: p!.published,
    year: p!.year,
    group: p!.groupText,
    icon: p!.icon,
  }

  const contentEl = p!.content?.trim() ? await renderContent(p!.content) : null

  return (
    <Container className="py-16 space-y-10">
      <header className="space-y-4 pb-8 border-b border-border">
        <h1 className="text-3xl font-semibold tracking-tight">{fm.title}</h1>
        <p className="text-secondary text-sm leading-relaxed">{fm.description}</p>
        <div className="flex flex-wrap gap-2">
          {fm.tech?.map(t => (
            <span key={t} className="text-xs text-muted border border-border rounded-sm px-2 py-0.5">{t}</span>
          ))}
        </div>
        <div className="flex gap-4 pt-1">
          {fm.github && (
            <a href={fm.github} target="_blank" rel="noopener noreferrer"
              className="text-sm text-secondary hover:text-accent transition-colors">GitHub →</a>
          )}
          {fm.demo && (
            <a href={fm.demo} target="_blank" rel="noopener noreferrer"
              className="text-sm text-secondary hover:text-accent transition-colors">在线预览 →</a>
          )}
        </div>
      </header>

      {contentEl && <div className="article-body">{contentEl}</div>}
    </Container>
  )
}
