import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { mdxComponents } from '@/features/blog/mdxComponents'
import type { ProjectFrontmatter } from '@/types'

interface Props { params: { slug: string } }

async function getProject(slug: string): Promise<{ frontmatter: ProjectFrontmatter; content: string } | null> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const res = await fetch(base + '/api/projects/' + slug, { cache: 'no-store' })
    const json = await res.json()
    if (!json.success) return null
    const p = json.data
    return {
      frontmatter: {
        title: p.title,
        description: p.description,
        tech: p.tech,
        github: p.github,
        demo: p.demo,
        published: p.published,
        year: p.year || '',
        group: p.groupText || '其他',
        icon: p.icon || '',
        attachments: p.attachments ? JSON.parse(p.attachments) : [],
      },
      content: p.content,
    }
  } catch { return null }
}

export async function generateMetadata({ params }: Props) {
  const project = await getProject(params.slug)
  if (!project) return {}
  return { title: project.frontmatter.title, description: project.frontmatter.description }
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject(params.slug)
  if (!project) notFound()

  const fm = project.frontmatter

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

        {fm.attachments && fm.attachments.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs text-muted uppercase tracking-widest">项目附件</p>
            <div className="flex flex-wrap gap-2">
              {fm.attachments.map((f: any, i: number) => (
                <a key={i} href={f.url} download={f.name} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs border border-border rounded-md px-3 py-1.5 hover:border-accent hover:text-accent transition-colors">
                  <span>📎</span>
                  <span>{f.name}</span>
                  <span className="text-muted">({(f.size / 1024).toFixed(1)} KB)</span>
                  <span className="text-muted">↓</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none prose-sm
        prose-headings:font-semibold prose-a:text-accent prose-a:no-underline hover:prose-a:underline
        prose-code:bg-bg-subtle prose-code:px-1 prose-code:rounded
        prose-pre:bg-bg-subtle prose-pre:border prose-pre:border-border">
        <MDXRemote source={project.content} components={mdxComponents} />
      </div>
    </Container>
  )
}
