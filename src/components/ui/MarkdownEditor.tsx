'use client'
import { useRef, useState } from 'react'

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

// 在光标处插入文本
function insertAt(
  textarea: HTMLTextAreaElement,
  before: string,
  after = '',
  placeholder = ''
): string {
  const { selectionStart: s, selectionEnd: e, value } = textarea
  const selected = value.slice(s, e) || placeholder
  const next = value.slice(0, s) + before + selected + after + value.slice(e)
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(s + before.length, s + before.length + selected.length)
  }, 0)
  return next
}

// 在行首插入前缀
function insertLinePrefix(textarea: HTMLTextAreaElement, prefix: string): string {
  const { selectionStart: s, value } = textarea
  const lineStart = value.lastIndexOf('\n', s - 1) + 1
  const next = value.slice(0, lineStart) + prefix + value.slice(lineStart)
  setTimeout(() => { textarea.focus(); textarea.setSelectionRange(s + prefix.length, s + prefix.length) }, 0)
  return next
}

const BTN = 'px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors font-mono'

export function MarkdownEditor({ value, onChange, height = 520 }: Props) {
  const [preview, setPreview] = useState(false)
  const [showH, setShowH] = useState(false)
  const [uploading, setUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function cmd(before: string, after = '', placeholder = '') {
    const ta = textareaRef.current
    if (!ta) return
    onChange(insertAt(ta, before, after, placeholder))
  }

  function lineCmd(prefix: string) {
    const ta = textareaRef.current
    if (!ta) return
    onChange(insertLinePrefix(ta, prefix))
  }

  async function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'))
    if (!item) return
    e.preventDefault()
    const file = item.getAsFile()
    if (!file) return
    setUploading(true)
    const url = await uploadImage(file)
    if (url) onChange(value + `\n![image](${url})\n`)
    setUploading(false)
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadImage(file)
    if (url) onChange(value + `\n![${file.name}](${url})\n`)
    e.target.value = ''
    setUploading(false)
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm" style={{ height }}>
      {/* 工具栏 */}
      <div className="flex items-center gap-0.5 px-2 py-1 bg-gray-50 border-b border-border flex-wrap">

        {/* 标题下拉 */}
        <div className="relative">
          <button type="button" className={BTN + ' font-bold'} onClick={() => setShowH(v => !v)} title="标题">
            H▾
          </button>
          {showH && (
            <div className="absolute top-full left-0 bg-white border border-border rounded-md shadow-lg z-50 py-1 min-w-[80px]">
              {[1,2,3,4,5,6].map(n => (
                <button key={n} type="button"
                  className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-50"
                  style={{ fontSize: 18 - n * 1.5 }}
                  onClick={() => { lineCmd('#'.repeat(n) + ' '); setShowH(false) }}>
                  H{n}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button type="button" className={BTN + ' font-bold'} onClick={() => cmd('**', '**', '粗体')} title="粗体">B</button>
        <button type="button" className={BTN + ' italic'} onClick={() => cmd('*', '*', '斜体')} title="斜体">I</button>
        <button type="button" className={BTN + ' line-through'} onClick={() => cmd('~~', '~~', '删除线')} title="删除线">S</button>

        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button type="button" className={BTN} onClick={() => cmd('[', '](url)', '链接文字')} title="链接">🔗</button>
        <button type="button" className={BTN} onClick={() => cmd('`', '`', '代码')} title="行内代码">&lt;/&gt;</button>
        <button type="button" className={BTN} onClick={() => cmd('\n```\n', '\n```\n', '代码块')} title="代码块">```</button>
        <button type="button" className={BTN} onClick={() => cmd('> ', '', '引用')} title="引用">&ldquo;</button>

        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button type="button" className={BTN} onClick={() => lineCmd('- ')} title="无序列表">≡</button>
        <button type="button" className={BTN} onClick={() => lineCmd('1. ')} title="有序列表">1.</button>
        <button type="button" className={BTN} onClick={() => lineCmd('- [ ] ')} title="任务列表">☑</button>

        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button type="button" className={BTN}
          onClick={() => cmd('\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n')}
          title="表格">⊞</button>
        <button type="button" className={BTN} onClick={() => onChange(value + '\n---\n')} title="分割线">—</button>

        <div className="w-px h-4 bg-gray-200 mx-1" />
        {/* 图片上传 */}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <button type="button" className={BTN + (uploading ? ' opacity-50' : '')}
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          title="上传图片">
          {uploading ? '⏳' : '🖼'}
        </button>

        <div className="flex-1" />
        <button type="button"
          className={`text-xs px-2 py-1 rounded transition-colors ${preview ? 'bg-accent text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          onClick={() => setPreview(v => !v)}>
          {preview ? '编辑' : '预览'}
        </button>
      </div>

      {/* 编辑 / 预览区 */}
      {preview ? (
        <div className="h-[calc(100%-42px)] overflow-auto p-4 article-body bg-white"
          dangerouslySetInnerHTML={{ __html: '' }}
        >
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder="开始写作... (支持 Markdown 语法，Ctrl+V 粘贴图片)"
          className="w-full h-[calc(100%-42px)] resize-none outline-none p-4 text-sm font-mono leading-relaxed bg-white"
          style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
        />
      )}

      {/* 点击其他地方关闭标题下拉 */}
      {showH && <div className="fixed inset-0 z-40" onClick={() => setShowH(false)} />}
    </div>
  )
}
