'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Project { slug: string; title: string; published?: boolean }

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch('/api/projects')
    const data = await res.json()
    setProjects(data.data ?? [])
    setLoading(false)
  }

  async function toggle(p: Project) {
    await fetch(`/api/projects/${p.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, published: !p.published }),
    })
    load()
  }

  async function del(slug: string) {
    if (!confirm(`确认删除 "${slug}"？`)) return
    await fetch(`/api/projects/${slug}`, { method: 'DELETE' })
    load()
  }

  useEffect(() => { load() }, [])

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">项目管理</h1>
        <div className="flex gap-4">
          <Link href="/admin/projects/new"
            className="text-sm bg-text text-bg rounded-sm px-4 py-2 hover:opacity-80 transition-opacity">
            新建项目
          </Link>
          <Link href="/admin/dashboard" className="text-sm text-muted hover:text-text transition-colors">← 返回</Link>
        </div>
      </div>

      {loading ? <p className="text-sm text-muted">加载中...</p>
        : projects.length === 0 ? <p className="text-sm text-muted">暂无项目。</p>
        : (
          <div className="space-y-1">
            {projects.map(p => (
              <div key={p.slug} className="flex items-center justify-between py-3 border-b border-border gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{p.title}</p>
                  <p className="text-xs text-muted">{p.slug}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className={`text-xs ${p.published ? 'text-green-500' : 'text-muted'}`}>
                    {p.published ? '已发布' : '草稿'}
                  </span>
                  <Link href={`/admin/projects/${p.slug}`} className="text-xs text-muted hover:text-text transition-colors">编辑</Link>
                  <button onClick={() => toggle(p)} className="text-xs text-muted hover:text-text transition-colors">
                    {p.published ? '下线' : '发布'}
                  </button>
                  <button onClick={() => del(p.slug)} className="text-xs text-red-400 hover:text-red-500 transition-colors">删除</button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
