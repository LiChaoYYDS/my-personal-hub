'use client'
import { useRef } from 'react'
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then(m => m.default),
  { ssr: false, loading: () => <div className="w-full rounded-xl border border-border bg-gray-50 animate-pulse" style={{ height: 520 }} /> }
)

interface Props {
  value: string
  onChange: (val: string) => void
  height?: number
}

async function uploadImage(file: File): Promise<string | null> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/uploads', { method: 'POST', body: fd })
  const data = await res.json()
  return data.success ? data.data.url : null
}

const uploadCommand = {
  name: 'upload-image',
  keyCommand: 'upload-image',
  buttonProps: { 'aria-label': '上传图片', title: '上传图片' },
  icon: (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  // execute 在组件内通过 ref 注入
  execute: () => {},
}

export function MarkdownEditor({ value, onChange, height = 520 }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  async function handlePaste(e: React.ClipboardEvent) {
    const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'))
    if (!item) return
    e.preventDefault()
    const file = item.getAsFile()
    if (!file) return
    const url = await uploadImage(file)
    if (url) onChange(value + `\n![image](${url})\n`)
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    if (url) onChange(value + `\n![${file.name}](${url})\n`)
    e.target.value = ''
  }

  const uploadCmd = {
    ...uploadCommand,
    execute: () => fileRef.current?.click(),
  }

  return (
    <div className="space-y-2">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <div data-color-mode="light" onPaste={handlePaste}>
        <MDEditor
          value={value}
          onChange={v => onChange(v ?? '')}
          height={height}
          preview="live"
          visibleDragbar={false}
          extraCommands={[uploadCmd]}
          style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        />
      </div>
      <p className="text-xs text-muted px-1">💡 Ctrl+V 粘贴图片，或点击工具栏 🖼 按钮上传</p>
    </div>
  )
}
