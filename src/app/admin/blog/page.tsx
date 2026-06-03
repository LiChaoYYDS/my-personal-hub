'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Post {
  slug: string
  title: string
  date: string
  published: boolean
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch('/api/blog')
    const data = await res.json()
    setPosts(data.data ?? [])
    setLoading(false)
  }

  async function togglePublish(slug: string, post: Post) {
    await fetch(`/api/blog/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, published: !post.published }),
    })
    load()
  }

  async function deletePost(slug: string) {
    if (!confirm(`确认删除 "${slug}"？`)) return
    await fetch(`/api/blog/${slug}`, { method: 'DELETE' })
    load()
  }

  useEffect(() => { load() }, [])

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">博客管理</h1>
        <div className="flex gap-4">
          <Link href="/admin/blog/new"
            className="text-sm bg-text text-bg rounded-sm px-4 py-2 hover:opacity-80 transition-opacity">
            新建文章
          </Link>
          <Link href="/admin/dashboard" className="text-sm text-muted hover:text-text transition-colors">
            ← 返回
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted">加载中...</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted">暂无文章，点击「新建文章」开始写作。</p>
      ) : (
        <div className="space-y-1">
          {posts.map(post => (
            <div key={post.slug}
              className="flex items-center justify-between py-3 border-b border-border gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{post.title}</p>
                <p className="text-xs text-muted">{post.slug} · {post.date}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className={`text-xs ${post.published ? 'text-green-500' : 'text-muted'}`}>
                  {post.published ? '已发布' : '草稿'}
                </span>
                <Link href={`/admin/blog/${post.slug}`}
                  className="text-xs text-muted hover:text-text transition-colors">
                  编辑
                </Link>
                <button onClick={() => togglePublish(post.slug, post)}
                  className="text-xs text-muted hover:text-text transition-colors">
                  {post.published ? '下线' : '发布'}
                </button>
                <button onClick={() => deletePost(post.slug)}
                  className="text-xs text-red-400 hover:text-red-500 transition-colors">
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
