import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import rehypePrettyCode from 'rehype-pretty-code'
import { prisma } from '@/lib/prisma'
import { extractHeadings } from '@/lib/mdx'
import { TableOfContents } from '@/features/blog/TableOfContents'
import { mdxComponents } from '@/features/blog/mdxComponents'

const mdxOptions = {
  rehypePlugins: [
    [rehypePrettyCode, { theme: 'one-dark-pro', keepBackground: true }],
  ],
  // 关闭 JSX/表达式解析，允许普通 Markdown 中的 {} <> 等字符
  format: 'md',
} as any

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug)
  const p = await prisma.project.findUnique({ where: { slug } })
  if (!p) return {}
  return { title: p.title, description: p.description }
}

async function renderContent(content: string) {
  try {
    return <MDXRemote source={content} components={mdxComponents} options={{ mdxOptions }} />
  } catch {
    // MDX 解析失败降级为纯文本
    return <pre className="whitespace-pre-wrap text-sm text-secondary leading-relaxed">{content}</pre>
  }
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug)
  const p = await prisma.project.findUnique({ where: { slug } })
  if (!p) notFound()

  const tech = Array.isArray(p.tech) ? p.tech : []
  const headings = extractHeadings(p.content ?? '')
  const attachments: { name: string; url: string; size?: number }[] = (() => {
    try { return JSON.parse(p.attachments || '[]') } catch { return [] }
  })()

  const contentEl = p.content?.trim() ? await renderContent(p.content) : null

  return (
    <>
      {/* 顶部封面 Banner */}
      <div className="relative w-full h-52 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://picsum.photos/seed/${encodeURIComponent(slug)}-proj/1600/400')` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          {p.icon && <span className="text-4xl mb-2">{p.icon}</span>}
          <h1 className="text-2xl font-bold drop-shadow-md max-w-3xl leading-snug">{p.title}</h1>
          <p className="mt-2 text-sm text-white/80 flex items-center gap-3 flex-wrap justify-center">
            {p.year && <span>📅 {p.year}</span>}
            {p.groupText && <><span>·</span><span>📁 {p.groupText}</span></>}
            {p.github && <><span>·</span>
              <a href={p.github} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
            </>}
            {p.demo && <><span>·</span>
              <a href={p.demo} target="_blank" rel="noopener noreferrer" className="hover:underline">Demo →</a>
            </>}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6 flex gap-6 items-start">
        <main className="flex-1 min-w-0 space-y-4">
          <div className="card-glass p-8 space-y-6">
            {/* 技术栈 */}
            {tech.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-5 border-b border-border">
                {tech.map(t => (
                  <span key={t} className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full px-3 py-1">{t}</span>
                ))}
              </div>
            )}

            {/* 描述 */}
            {p.description && (
              <p className="text-secondary text-sm leading-relaxed">{p.description}</p>
            )}

            {/* Markdown 内容（与博客相同样式） */}
            {contentEl && <div className="article-body">{contentEl}</div>}
          </div>

          {/* 附件下载 */}
          {attachments.length > 0 && (
            <div className="card-glass p-6 space-y-3">
              <p className="text-sm font-semibold text-text flex items-center gap-1.5">
                <span>📎</span> 项目附件
              </p>
              <div className="space-y-2">
                {attachments.map((f, i) => (
                  <a key={i} href={f.url} download={f.name} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 border border-border rounded-lg px-4 py-3 hover:border-accent hover:bg-indigo-50/50 transition-all group">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg shrink-0">📄</span>
                      <span className="text-sm text-text truncate group-hover:text-accent transition-colors">{f.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {f.size && <span className="text-xs text-muted">{(f.size / 1024).toFixed(1)} KB</span>}
                      <span className="text-xs bg-accent text-white rounded-md px-2 py-1">下载 ↓</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* 右侧目录 */}
        <div className="w-64 shrink-0 sticky top-20 space-y-4">
          {headings.length > 0 && (
            <div className="card-glass p-4">
              <TableOfContents headings={headings} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
