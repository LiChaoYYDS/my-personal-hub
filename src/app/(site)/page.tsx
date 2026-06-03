import { getAllPosts, getAllProjects } from '@/lib/mdx'
import { PageTransition } from '@/components/ui/motion'
import { HomeBanner } from '@/features/home/HomeBanner'
import { HomePosts } from '@/features/home/HomePosts'
import { HomeProjects } from '@/features/home/HomeProjects'
import { Sidebar } from '@/components/layout/Sidebar'

export default function HomePage() {
  const posts = getAllPosts().filter(p => p.frontmatter.published).slice(0, 5)
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
