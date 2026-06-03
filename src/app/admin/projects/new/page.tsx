'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectForm } from '@/features/project/ProjectForm'

export default function NewProjectPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (result.success) router.push('/admin/projects')
    else setError(result.message)
  }

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">新建项目</h1>
        <a href="/admin/projects" className="text-sm text-muted hover:text-text transition-colors">← 返回</a>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <ProjectForm onSubmit={handleSubmit} submitLabel="创建项目" />
    </div>
  )
}
