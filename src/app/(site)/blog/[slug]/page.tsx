import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const raw = params.slug
  const decoded = decodeURIComponent(raw)

  const all = await prisma.blogPost.findMany({
    select: { slug: true, title: true, published: true },
  })

  const post = await prisma.blogPost.findFirst({
    where: { OR: [{ slug: raw }, { slug: decoded }] },
  })

  return (
    <div style={{ fontFamily: 'monospace', padding: 32 }}>
      <h2>Debug Info</h2>
      <p><b>params.slug (raw):</b> {raw}</p>
      <p><b>decoded:</b> {decoded}</p>
      <p><b>post found:</b> {post ? '✅ YES' : '❌ NO'}</p>
      <hr />
      <h3>All posts in DB:</h3>
      {all.map(p => (
        <div key={p.slug} style={{ marginBottom: 8 }}>
          <b>slug:</b> <code>{p.slug}</code> |
          <b> title:</b> {p.title} |
          <b> published:</b> {String(p.published)}
        </div>
      ))}
    </div>
  )
}
