'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MarkdownEditor } from '@/components/ui/MarkdownEditor'

export default function NewLifeRecordPage() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')
  const [mood, setMood] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    const urls: string[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/uploads', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) urls.push(data.data.url)
    }
    setImages(prev => [...prev, ...urls])
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    await fetch('/api/life', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, location, mood, images }),
    })
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">发布动态</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <MarkdownEditor value={content} onChange={setContent} />

        <div className="grid grid-cols-2 gap-3">
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="📍 地点（可选）"
            className="border border-border rounded-md px-3 py-2 text-sm bg-bg outline-none focus:border-accent" />
          <input value={mood} onChange={e => setMood(e.target.value)} placeholder="心情（可选）"
            className="border border-border rounded-md px-3 py-2 text-sm bg-bg outline-none focus:border-accent" />
        </div>

        <div>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
            onChange={e => handleFiles(e.target.files)} />
          <button type="button" onClick={() => fileRef.current?.click()}
            className="text-sm text-muted border border-dashed border-border rounded-md px-4 py-3 w-full hover:border-accent hover:text-accent transition-colors">
            {uploading ? '上传中...' : '+ 添加图片'}
          </button>
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} alt="" className="rounded-md aspect-square object-cover w-full" />
                  <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={submitting || !content.trim()}
            className="bg-text text-bg rounded-sm px-6 py-2 text-sm hover:opacity-80 disabled:opacity-40 transition-opacity">
            {submitting ? '发布中...' : '发布'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="text-sm text-muted hover:text-text transition-colors px-3 py-2">
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
