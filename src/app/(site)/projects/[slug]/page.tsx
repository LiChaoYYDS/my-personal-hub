import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import { getAllProjects, getProjectBySlug } from '@/lib/mdx'
import { Container } from '@/components/layout/Container'
import { mdxComponents } from '@/features/blog/mdxComponents'
import type { ProjectFrontmatter } from '@/types'

export async function generateStaticParams() {
  try { return getAllProjects().map(p => ({ slug: p.slug })) } catch { return [] }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const p = getProjectBySlug(params.slug)
    const fm = p.frontmatter as ProjectFrontmatter
    return { title: fm.title, description: fm.description }
  } catch { return {} }
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  let project: ReturnType<typeof getProjectBySlug>
  try { project = getProjectBySlug(params.slug) } catch { notFound() }

  const fm = project!.frontmatter as ProjectFrontmatter

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

        {/* 项目附件 */}
        {fm.attachments && fm.attachments.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs text-muted uppercase tracking-widest">项目附件</p>
            <div className="flex flex-wrap gap-2">
              {fm.attachments.map((f, i) => (
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
        <MDXRemote source={project!.content} components={mdxComponents} />
      </div>
    </Container>
  )
}
