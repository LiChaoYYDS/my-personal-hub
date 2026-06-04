export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { PageTransition } from '@/components/ui/motion'
import { ArchiveTimeline } from '@/features/blog/ArchiveTimeline'
import { Sidebar } from '@/components/layout/Sidebar'

export const metadata = { title: '归档', description: '全部文章' }

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { date: 'desc' },
    select: { slug: true, title: true, summary: true, date: true },
  })

  // date 转成 string 以匹配 ArchiveTimeline 的 Post 接口
  const rows = posts.map(p => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    date: p.date.toISOString().slice(0, 10),
  }))

  return (
    <PageTransition>
      <div className="relative w-full h-52 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&auto=format&fit=crop')" }} />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">归档</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6 flex gap-6 items-start">
        <main className="flex-1 min-w-0">
          <ArchiveTimeline posts={rows} />
        </main>
        <Sidebar />
      </div>
    </PageTransition>
  )
}
