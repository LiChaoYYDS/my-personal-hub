'use client'
import { useState, useRef } from 'react'
import { MarkdownEditor } from '@/components/ui/MarkdownEditor'

interface UploadedFile { name: string; url: string; size: number }

interface ProjectFormProps {
  initial?: Record<string, unknown>
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  submitLabel: string
  disableSlug?: boolean
}

export function ProjectForm({ initial, onSubmit, submitLabel, disableSlug }: ProjectFormProps) {
  const [slug, setSlug] = useState((initial?.slug as string) ?? '')
  const [title, setTitle] = useState((initial?.title as string) ?? '')
  const [description, setDescription] = useState((initial?.description as string) ?? '')
  const [tech, setTech] = useState((initial?.tech as string[])?.join(', ') ?? '')
  const [github, setGithub] = useState((initial?.github as string) ?? '')
  const [demo, setDemo] = useState((initial?.demo as string) ?? '')
  const [published, setPublished] = useState((initial?.published as boolean) ?? false)
  const [content, setContent] = useState((initial?.content as string) ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>((initial?.attachments as UploadedFile[]) ?? [])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    if (!selected.length) return
    setUploading(true)
    for (const file of selected) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/uploads', { method: 'POST', body: fd })
      const json = await res.json()
      console.log('upload result:', json)
      if (json.success) setFiles(prev => [...prev, { name: file.name, url: json.data.url, size: file.size }])
      else alert(`上传失败：${json.message}`)
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit({
      slug, title, description,
      tech: tech.split(',').map(t => t.trim()).filter(Boolean),
      github, demo, published, content, attachments: files,
    })
    setSubmitting(false)
  }

  const cls = 'w-full border border-border rounded-sm px-3 py-2 text-sm bg-bg outline-none focus:border-accent'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted">Slug</label>
          <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="my-project"
            required disabled={disableSlug}
            className={`${cls} ${disableSlug ? 'opacity-50 cursor-not-allowed' : ''}`} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted">标题</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="项目名称" required className={cls} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted">简介</label>
        <input value={description} onChange={e => setDescription(e.target.value)}
          placeholder="一句话描述项目" className={cls} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted">技术栈（逗号分隔）</label>
          <input value={tech} onChange={e => setTech(e.target.value)}
            placeholder="Next.js, TypeScript" className={cls} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted">GitHub 链接</label>
          <input value={github} onChange={e => setGithub(e.target.value)}
            placeholder="https://github.com/..." className={cls} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted">Demo 链接</label>
        <input value={demo} onChange={e => setDemo(e.target.value)}
          placeholder="https://..." className={cls} />
      </div>

      {/* 项目附件 */}
      <div className="space-y-2">
        <label className="text-xs text-muted">项目附件</label>
        <div onClick={() => fileRef.current?.click()}
          className="border border-dashed border-border rounded-sm px-4 py-5 text-center cursor-pointer hover:border-accent hover:bg-bg-subtle transition-colors">
          <p className="text-sm text-muted">{uploading ? '上传中...' : '点击上传文件（图片、PDF、ZIP，最大 50MB）'}</p>
          <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFileChange}
            accept="image/*,.pdf,.zip,.txt" />
        </div>
        {files.length > 0 && (
          <ul className="space-y-1.5">
            {files.map((f, i) => (
              <li key={i} className="text-xs bg-bg-subtle border border-border rounded px-3 py-2.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text truncate max-w-xs">{f.name}</span>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="text-muted">{(f.size / 1024).toFixed(1)} KB</span>
                    <button type="button" onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                      className="text-muted hover:text-red-500 transition-colors">✕</button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted shrink-0">📎 存储路径：</span>
                  <a href={f.url} target="_blank" rel="noopener noreferrer"
                    className="text-accent hover:underline truncate">{f.url}</a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted">项目详情（Markdown）</label>
        <MarkdownEditor value={content} onChange={setContent} rows={12} />
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
