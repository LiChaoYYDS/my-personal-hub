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

// H1-H6 标题插入命令
function makeHeadingCommand(level: number) {
  const prefix = '#'.repeat(level) + ' '
  return {
    name: `heading${level}`,
    keyCommand: `heading${level}`,
    buttonProps: { 'aria-label': `H${level}`, title: `标题 ${level}` },
    icon: <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '-0.5px' }}>H{level}</span>,
    execute: (state: any, api: any) => {
      const line = state.text.slice(0, state.selection.start).split('\n').pop() ?? ''
      const existingPrefix = line.match(/^(#{1,6})\s/)?.[0] ?? ''
      if (existingPrefix) {
        // 替换已有标题级别
        api.replaceSelection(state.selectedText
          ? state.selectedText.replace(new RegExp(`^${existingPrefix}`, 'm'), prefix)
          : prefix
        )
      } else {
        api.replaceSelection(prefix + (state.selectedText || '标题'))
      }
    },
  }
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
          commands={[
            // H1-H6 标题
            makeHeadingCommand(1),
            makeHeadingCommand(2),
            makeHeadingCommand(3),
            makeHeadingCommand(4),
            makeHeadingCommand(5),
            makeHeadingCommand(6),
            { name: 'divider1', keyCommand: 'divider1', icon: <span>|</span>, execute: () => {} },
            // 保留原始常用命令
            ...['bold','italic','strikethrough','hr','link','quote','code','codeBlock','unorderedListCommand','orderedListCommand','checkedListCommand'].map(
              name => ({ name, keyCommand: name, execute: () => {} })
            ),
          ]}
          extraCommands={[uploadCommand]}
          style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        />
      </div>
      <p className="text-xs text-muted px-1">💡 工具栏可选 H1-H6 标题；Ctrl+V 粘贴图片或点击 🖼 上传</p>
    </div>
  )
}
