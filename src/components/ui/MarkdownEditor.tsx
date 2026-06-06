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
  if (!file.type.startsWith('image/')) return null
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/uploads', { method: 'POST', body: fd })
  const data = await res.json()
  return data.success ? data.data.url : null
}

function insertImageMarkdown(url: string, filename: string, value: string, onChange: (v: string) => void) {
  const md = `![${filename}](${url})`
  onChange(value ? `${value}\n${md}` : md)
}

export function MarkdownEditor({ value, onChange, height = 520 }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 粘贴图片
  async function handlePaste(e: React.ClipboardEvent) {
    const items = Array.from(e.clipboardData.items)
    const imageItem = items.find(i => i.type.startsWith('image/'))
    if (!imageItem) return
    e.preventDefault()
    const file = imageItem.getAsFile()
    if (!file) return
    const url = await uploadImage(file)
    if (url) insertImageMarkdown(url, 'image', value, onChange)
  }

  // 工具栏点击上传
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    if (url) insertImageMarkdown(url, file.name.replace(/\.[^.]+$/, ''), value, onChange)
    e.target.value = ''
  }

  return (
    <div data-color-mode="light" onPaste={handlePaste}>
      {/* 隐藏文件输入 */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* 自定义工具栏按钮覆盖默认图片按钮 */}
      <div className="relative">
        <MDEditor
          value={value}
          onChange={v => onChange(v ?? '')}
          height={height}
          preview="live"
          visibleDragbar={false}
          style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          commands={[
            // 保留所有默认命令，额外注入图片上传命令
            ...require('@uiw/react-md-editor').commands.getCommands(),
          ]}
          extraCommands={[
            {
              name: 'upload-image',
              keyCommand: 'upload-image',
              buttonProps: { 'aria-label': '上传图片', title: '上传图片（支持粘贴）' },
              icon: (
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              ),
              execute: () => fileInputRef.current?.click(),
            },
            ...require('@uiw/react-md-editor').commands.getExtraCommands(),
          ]}
        />
      </div>

      <p className="text-xs text-muted mt-1.5 px-1">💡 支持粘贴图片（Ctrl+V）或点击右上角 📷 按钮上传</p>
    </div>
  )
}
