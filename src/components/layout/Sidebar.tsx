import Image from 'next/image'
import Link from 'next/link'
import { getAllProjects } from '@/lib/mdx'
import { prisma } from '@/lib/prisma'

export async function Sidebar() {
  const [blogCount, lifeCount, latestPosts] = await Promise.all([
    prisma.blogPost.count({ where: { published: true } }),
    prisma.lifeRecord.count(),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { date: 'desc' },
      take: 5,
      select: { slug: true, title: true },
    }),
  ])

  const projects = getAllProjects().filter(p => (p.frontmatter as any).published !== false)

  return (
    <aside className="space-y-4 w-72 shrink-0">
      <div className="card-glass p-5 text-center space-y-3">
        <div className="mx-auto w-20 h-20 rounded-full overflow-hidden ring-2 ring-border">
          <Image src="/avatar-snake.svg" alt="avatar" width={80} height={80} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-bold text-base text-text">ChaoBlog</p>
          <p className="text-xs text-secondary mt-1">全栈开发者 · AI 实践者 · 创作者</p>
        </div>
        <div className="flex justify-center gap-6 py-2 border-y border-border text-center">
          <div><p className="font-bold text-sm text-text">{blogCount}</p><p className="text-xs text-muted">文章</p></div>
          <div><p className="font-bold text-sm text-text">{projects.length}</p><p className="text-xs text-muted">项目</p></div>
          <div><p className="font-bold text-sm text-text">{lifeCount}</p><p className="text-xs text-muted">生活记录</p></div>
        </div>
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover text-white text-sm font-medium py-2 rounded-md transition-colors">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.78 1.3 3.46.99.1-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
          Follow Me
        </a>
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center text-secondary hover:text-text transition-colors">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.78 1.3 3.46.99.1-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
      </div>

      <div className="card-glass p-4 space-y-2">
        <p className="text-sm font-semibold text-text flex items-center gap-1.5"><span>📢</span> 公告</p>
        <p className="text-xs text-secondary leading-relaxed">即使再小的帆也能远航 ⚠️</p>
      </div>

      <div className="card-glass p-4 space-y-3">
        <p className="text-sm font-semibold text-text flex items-center gap-1.5"><span>🕐</span> 最新文章</p>
        <div className="space-y-2">
          {latestPosts.map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`}
              className="block text-xs text-secondary hover:text-accent transition-colors truncate">
              · {p.title}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
