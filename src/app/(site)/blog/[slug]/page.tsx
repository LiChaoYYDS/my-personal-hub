import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import rehypePrettyCode from 'rehype-pretty-code'
import { prisma } from '@/lib/prisma'
import { extractHeadings } from '@/lib/mdx'
import readingTime from 'reading-time'
import { TableOfContents } from '@/features/blog/TableOfContents'
import { mdxComponents } from '@/features/blog/mdxComponents'

const mdxOptions = {
  rehypePlugins: [
    [rehypePrettyCode, {
      theme: 'one-dark-pro',
      keepBackground: true,
    }],
  ],
} as any

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug)
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post) return {}
  return { title: post.title, description: post.summary }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug)
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post) notFound()

  const headings = extractHeadings(post!.content)
  const dateStr = post!.date.toISOString().slice(0, 10)
  const readTime = readingTime(post!.content).text

  return (
    <>
      <div className="relative w-full h-52 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://picsum.photos/seed/${encodeURIComponent(slug)}/1600/400')` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-2xl font-bold drop-shadow-md max-w-3xl leading-snug">{post!.title}</h1>
          <p className="mt-2 text-sm text-white/80 flex items-center gap-3 flex-wrap justify-center">
            <span>📅 发表于 {dateStr}</span>
            <span>·</span>
            <span>{readTime}</span>
            {post!.tags[0] && <><span>·</span><span>📁 {post!.tags[0]}</span></>}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6 flex gap-6 items-start">
        <main className="flex-1 min-w-0">
          <div className="card-glass p-8">
            <div className="article-body">
              <MDXRemote source={post!.content} components={mdxComponents} options={{ mdxOptions }} />
            </div>
          </div>
        </main>

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
