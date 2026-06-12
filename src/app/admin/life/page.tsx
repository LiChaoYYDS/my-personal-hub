// @ts-nocheck
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface LifeRecord {
  id: string
  content: string
  images: string[]
  location?: string
  mood?: string
  createdAt: string
}

export default function AdminLifePage() {
  const [records, setRecords] = useState<LifeRecord[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch('/api/life')
    const data = await res.json()
    setRecords(data.data ?? [])
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('确认删除这条动态？')) return
    await fetch(`/api/life/${id}`, { method: 'DELETE' })
    load()
  }

  useEffect(() => { load() }, [])

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">生活动态管理</h1>
        <div className="flex gap-4">
          <Link href="/admin/life/new"
            className="text-sm bg-text text-bg rounded-sm px-4 py-2 hover:opacity-80 transition-opacity">
            发布动态
          </Link>
          <Link href="/admin/dashboard" className="text-sm text-muted hover:text-text transition-colors">
            ← 返回
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted">加载中...</p>
      ) : records.length === 0 ? (
        <p className="text-sm text-muted">暂无动态。</p>
      ) : (
        <div className="space-y-1">
          {records.map(r => (
            <div key={r.id} className="flex items-start justify-between py-4 border-b border-border gap-4">
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm line-clamp-2">{r.content}</p>
                <div className="flex gap-3 text-xs text-muted">
                  <span>{new Date(r.createdAt).toLocaleDateString('zh-CN')}</span>
                  {r.location && <span>📍 {r.location}</span>}
                  {r.images.length > 0 && <span>{r.images.length} 张图片</span>}
                </div>
              </div>
              <button onClick={() => handleDelete(r.id)}
                className="text-xs text-red-400 hover:text-red-500 transition-colors shrink-0">
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
