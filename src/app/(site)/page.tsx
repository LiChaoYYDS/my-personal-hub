// @ts-nocheck
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { getAllProjects } from '@/lib/mdx'
import { PageTransition } from '@/components/ui/motion'
import { HomeBanner } from '@/features/home/HomeBanner'
import { HomePosts } from '@/features/home/HomePosts'
import { HomeProjects } from '@/features/home/HomeProjects'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function HomePage() {
  const dbPosts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { date: 'desc' },
    take: 5,
    select: { slug: true, title: true, content: true, summary: true, date: true, tags: true, category: true },
  })

  // 转换成前端组件需要的格式（兼容 PostFrontmatter 接口）
  const posts = dbPosts.map(p => ({
    slug: p.slug,
    frontmatter: {
      title: p.title,
      date: p.date.toISOString().slice(0, 10),
      summary: p.summary,
      tags: p.tags,
      category: p.category,
      published: true,
    },
    content: p.content,
  }))

  const projects = getAllProjects()
    .filter(p => (p.frontmatter as any).published !== false)
    .slice(0, 3)

  return (
    <PageTransition>
      <HomeBanner />
      <div className="mx-auto max-w-6xl px-6 py-6 flex gap-6 items-start">
        <main className="flex-1 min-w-0 space-y-4">
          {posts.length > 0 && <HomePosts posts={posts} />}
          {projects.length > 0 && <HomeProjects projects={projects} />}
        </main>
        <Sidebar />
      </div>
    </PageTransition>
  )
}
