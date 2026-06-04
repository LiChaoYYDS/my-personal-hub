import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const [blogCount, lifeCount, uploadCount] = await Promise.all([
    prisma.blogPost.count(),
    prisma.lifeRecord.count(),
    prisma.upload.count(),
  ])

  const stats = [
    { label: '博客文章', value: blogCount },
    { label: '生活记录', value: lifeCount },
    { label: '上传文件', value: uploadCount },
  ]

  const actions = [
    { label: '管理博客文章', href: '/admin/blog' },
    { label: '新建博客文章', href: '/admin/blog/new' },
    { label: '管理项目', href: '/admin/projects' },
    { label: '新建项目', href: '/admin/projects/new' },
    { label: '发布生活动态', href: '/admin/life/new' },
    { label: '管理生活动态', href: '/admin/life' },
  ]

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <form action="/api/auth/logout" method="POST">
          <button className="text-xs text-muted hover:text-text transition-colors">退出</button>
        </form>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="border border-border rounded-md p-4 space-y-1">
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-muted">操作</h2>
        <div className="space-y-0">
          {actions.map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center justify-between py-3 border-b border-border text-sm hover:text-accent transition-colors">
              <span>{item.label}</span><span>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
