import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, extractHeadings } from '@/lib/mdx'
import { TableOfContents } from '@/features/blog/TableOfContents'
import { mdxComponents } from '@/features/blog/mdxComponents'
import { Sidebar } from '@/components/layout/Sidebar'

export async function generateStaticParams() {
  try { return getAllPosts().map(p => ({ slug: p.slug })) } catch { return [] }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = getPostBySlug(params.slug)
    return { title: post.frontmatter.title, description: post.frontmatter.summary }
  } catch { return {} }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post: ReturnType<typeof getPostBySlug>
  try { post = getPostBySlug(params.slug) } catch { notFound() }

  const headings = extractHeadings(post!.content)
  const cover = (post!.frontmatter as any).cover
    ?? `https://picsum.photos/seed/${params.slug}/1600/400`

  return (
    <>
      {/* Banner */}
      <div className="relative w-full h-52 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${cover}')` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-2xl font-bold drop-shadow-md max-w-3xl leading-snug">
            {post!.frontmatter.title}
          </h1>
          <p className="mt-2 text-sm text-white/80 flex items-center gap-3 flex-wrap justify-center">
            <span>📅 发表于 {post!.frontmatter.date}</span>
            <span>·</span>
            <span>{post!.readingTime}</span>
            {post!.frontmatter.tags?.[0] && (
              <><span>·</span><span>📁 {post!.frontmatter.tags[0]}</span></>
            )}
          </p>
        </div>
      </div>

      {/* 两栏布局 */}
      <div className="mx-auto max-w-6xl px-6 py-6 flex gap-6 items-start">
        <main className="flex-1 min-w-0">
          <div className="card-glass p-8">
            <div className="prose prose-neutral dark:prose-invert max-w-none
              prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-text
              prose-p:text-secondary prose-li:text-secondary prose-strong:text-text
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-code:text-sm prose-code:bg-bg-subtle prose-code:px-1 prose-code:rounded
              prose-pre:bg-bg-subtle prose-pre:border prose-pre:border-border">
              <MDXRemote source={post!.content} components={mdxComponents} />
            </div>
          </div>
        </main>

        <div className="w-72 shrink-0 space-y-4 sticky top-20">
          <Sidebar />
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
