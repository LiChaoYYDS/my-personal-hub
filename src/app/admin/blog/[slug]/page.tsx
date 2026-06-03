'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PostForm } from '@/features/blog/PostForm'

export default function EditBlogPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/blog/${params.slug}`)
      .then(r => r.json())
      .then(r => {
        if (r.success) setInitial({ ...r.data.frontmatter, slug: r.data.slug, content: r.data.content })
        else setError(r.message)
      })
  }, [params.slug])

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch(`/api/blog/${params.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (result.success) router.push('/admin/blog')
    else setError(result.message)
  }

  if (!initial) return <div className="p-8 text-sm text-muted">{error || '加载中...'}</div>

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">编辑文章</h1>
        <a href="/admin/blog" className="text-sm text-muted hover:text-text transition-colors">← 返回</a>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <PostForm initial={initial} onSubmit={handleSubmit} submitLabel="保存修改" disableSlug />
    </div>
  )
}
