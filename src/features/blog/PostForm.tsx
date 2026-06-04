'use client'
import { useState } from 'react'
import { MarkdownEditor } from '@/components/ui/MarkdownEditor'

interface PostFormProps {
  initial?: Record<string, unknown>
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  submitLabel: string
  disableSlug?: boolean
}

export function PostForm({ initial, onSubmit, submitLabel, disableSlug }: PostFormProps) {
  const [slug, setSlug] = useState((initial?.slug as string) ?? '')
  const [title, setTitle] = useState((initial?.title as string) ?? '')
  const [date, setDate] = useState((initial?.date as string) ?? new Date().toISOString().slice(0, 10))
  const [tags, setTags] = useState((initial?.tags as string[])?.join(', ') ?? '')
  const [category, setCategory] = useState((initial?.category as string) ?? '')
  const [summary, setSummary] = useState((initial?.summary as string) ?? '')
  const [published, setPublished] = useState((initial?.published as boolean) ?? false)
  const [content, setContent] = useState((initial?.content as string) ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [generating, setGenerating] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit({
      slug, title, date,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      category, summary, published, content,
    })
    setSubmitting(false)
  }

  async function handleGenerate() {
    if (!title || !content) return
    setGenerating(true)
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })
    const data = await res.json()
    if (data.success) {
      if (data.data.summary) setSummary(data.data.summary)
      if (data.data.tags?.length) setTags(data.data.tags.join(', '))
    }
    setGenerating(false)
  }

  const cls = 'w-full border border-border rounded-sm px-3 py-2 text-sm bg-bg outline-none focus:border-accent'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted">Slug（文章 URL）</label>
          <input value={slug} onChange={e => setSlug(e.target.value)}
            placeholder="hello-world" required disabled={disableSlug}
            className={`${cls} ${disableSlug ? 'opacity-50 cursor-not-allowed' : ''}`} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted">日期</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={cls} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted">标题</label>
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="文章标题" required className={cls} />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted">正文（Markdown / MDX）</label>
        <MarkdownEditor value={content} onChange={setContent} />
      </div>

      {/* AI 生成区域 */}
      <div className="border border-border rounded-md p-4 space-y-3 bg-bg-subtle">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">AI 自动生成摘要与标签</span>
          <button type="button" onClick={handleGenerate}
            disabled={generating || !title || !content}
            className="text-xs bg-accent text-white rounded-sm px-3 py-1 hover:opacity-80 disabled:opacity-40 transition-opacity">
            {generating ? '生成中...' : '✦ AI 生成'}
          </button>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted">摘要</label>
          <input value={summary} onChange={e => setSummary(e.target.value)}
            placeholder="一句话描述（可手动填写或 AI 生成）" className={cls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted">标签（逗号分隔）</label>
            <input value={tags} onChange={e => setTags(e.target.value)}
              placeholder="Next.js, AI, 技术" className={cls} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted">分类</label>
            <input value={category} onChange={e => setCategory(e.target.value)}
              placeholder="技术" className={cls} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary">
          <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)}
            className="accent-accent" />
          立即发布
        </label>
        <button type="submit" disabled={submitting}
          className="bg-text text-bg rounded-sm px-6 py-2 text-sm hover:opacity-80 disabled:opacity-40 transition-opacity">
          {submitting ? '保存中...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
