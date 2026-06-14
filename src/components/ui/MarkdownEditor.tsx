'use client'
import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  value: string
  onChange: (val: string) => void
  height?: number
}

async function uploadImage(file: File): Promise<string | null> {
  const fd = new FormData()
  fd.append('file', file)
  try {
    const res = await fetch('/api/uploads', { method: 'POST', body: fd })
    const text = await res.text()
    if (!text.trim()) {
      alert('上传失败：服务器无响应（' + res.status + '）')
      return null
    }
    const data = JSON.parse(text)
    if (!data.success) {
      alert('上传失败：' + (data.message || '未知错误'))
      return null
    }
    return data.data.url
  } catch (e: any) {
    alert('上传失败：' + (e?.message || '网络错误'))
    return null
  }
}

function insertAt(ta: HTMLTextAreaElement, before: string, after = '', placeholder = '') {
  const { selectionStart: s, selectionEnd: e, value } = ta
  const selected = value.slice(s, e) || placeholder
  const next = value.slice(0, s) + before + selected + after + value.slice(e)
  setTimeout(() => { ta.focus(); ta.setSelectionRange(s + before.length, s + before.length + selected.length) }, 0)
  return next
}

function insertLinePrefix(ta: HTMLTextAreaElement, prefix: string) {
  const { selectionStart: s, value } = ta
  const lineStart = value.lastIndexOf('\n', s - 1) + 1
  const next = value.slice(0, lineStart) + prefix + value.slice(lineStart)
  setTimeout(() => { ta.focus(); ta.setSelectionRange(s + prefix.length, s + prefix.length) }, 0)
  return next
}

const B = 'px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors'

export function MarkdownEditor({ value, onChange, height = 520 }: Props) {
  const [preview, setPreview] = useState(false)
  const [showH, setShowH] = useState(false)
  const [uploading, setUploading] = useState(false)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function cmd(before: string, after = '', placeholder = '') {
    if (taRef.current) onChange(insertAt(taRef.current, before, after, placeholder))
  }
  function lineCmd(prefix: string) {
    if (taRef.current) onChange(insertLinePrefix(taRef.current, prefix))
  }

  async function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'))
    if (!item) return
    e.preventDefault()
    const file = item.getAsFile()
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadImage(file)
      if (url) onChange(value + `\n![image](${url})\n`)
    } finally {
      setUploading(false)
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadImage(file)
      if (url) onChange(value + `\n![${file.name}](${url})\n`)
    } finally {
      e.target.value = ''
      setUploading(false)
    }
  }

  const toolbarHeight = 42

  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-white" style={{ height }}>
      {/* 工具栏 */}
      <div className="flex items-center gap-0.5 px-2 bg-gray-50 border-b border-border flex-wrap" style={{ minHeight: toolbarHeight }}>

        {/* H1-H6 下拉 */}
        <div className="relative">
          <button type="button" className={B + ' font-bold'} onClick={() => setShowH(v => !v)}>H▾</button>
          {showH && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowH(false)} />
              <div className="absolute top-full left-0 bg-white border border-border rounded-md shadow-lg z-50 py-1 min-w-[72px]">
                {[1,2,3,4,5,6].map(n => (
                  <button key={n} type="button"
                    className="block w-full text-left px-3 py-1 hover:bg-gray-50"
                    style={{ fontSize: Math.max(11, 18 - n * 1.5), fontWeight: 700 }}
                    onClick={() => { lineCmd('#'.repeat(n) + ' '); setShowH(false) }}>
                    H{n}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <span className="w-px h-4 bg-gray-200 mx-0.5" />
        <button type="button" className={B + ' font-bold'} onClick={() => cmd('**', '**', '粗体')} title="粗体">B</button>
        <button type="button" className={B + ' italic font-serif'} onClick={() => cmd('*', '*', '斜体')} title="斜体">I</button>
        <button type="button" className={B + ' line-through'} onClick={() => cmd('~~', '~~', '删除线')} title="删除线">S</button>

        <span className="w-px h-4 bg-gray-200 mx-0.5" />
        <button type="button" className={B} onClick={() => cmd('[', '](https://)', '链接文字')} title="链接">🔗</button>
        <button type="button" className={B + ' font-mono'} onClick={() => cmd('`', '`', '代码')} title="行内代码">`</button>
        <button type="button" className={B + ' font-mono text-[10px]'} onClick={() => cmd('\n```\n', '\n```\n', '代码')} title="代码块">```</button>
        <button type="button" className={B} onClick={() => lineCmd('> ')} title="引用">❝</button>

        <span className="w-px h-4 bg-gray-200 mx-0.5" />
        <button type="button" className={B} onClick={() => lineCmd('- ')} title="无序列表">•≡</button>
        <button type="button" className={B} onClick={() => lineCmd('1. ')} title="有序列表">1≡</button>
        <button type="button" className={B} onClick={() => lineCmd('- [ ] ')} title="任务列表">☑</button>

        <span className="w-px h-4 bg-gray-200 mx-0.5" />
        <button type="button" className={B}
          onClick={() => cmd('\n| 列1 | 列2 |\n| --- | --- |\n| 内容 | 内容 |\n')}
          title="表格">⊞</button>
        <button type="button" className={B} onClick={() => onChange(value + '\n\n---\n\n')} title="分割线">—</button>

        <span className="w-px h-4 bg-gray-200 mx-0.5" />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <button type="button" className={B + (uploading ? ' opacity-50 cursor-wait' : '')}
          onClick={() => !uploading && fileRef.current?.click()}
          title="上传图片">
          {uploading ? '⏳' : '🖼️'}
        </button>

        <div className="flex-1" />
        <button type="button"
          className={`text-xs px-3 py-1 rounded-md transition-colors ${preview ? 'bg-accent text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          onClick={() => setPreview(v => !v)}>
          {preview ? '✏️ 编辑' : '👁 预览'}
        </button>
      </div>

      {/* 内容区 */}
      <div style={{ height: `calc(100% - ${toolbarHeight}px)` }} className="overflow-auto">
        {preview ? (
          <div className="p-5 article-body min-h-full">
            {value.trim()
              ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
              : <p className="text-gray-300 text-sm">暂无内容</p>
            }
          </div>
        ) : (
          <textarea
            ref={taRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onPaste={handlePaste}
            placeholder="开始写作... 支持 Markdown 语法，Ctrl+V 可粘贴图片"
            className="w-full h-full resize-none outline-none p-4 text-sm leading-relaxed bg-white"
            style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
          />
        )}
      </div>
    </div>
  )
}
