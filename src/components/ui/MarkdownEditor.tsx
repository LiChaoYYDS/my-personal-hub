'use client'
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then(m => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-xl border border-border bg-gray-50 animate-pulse" style={{ height: 520 }} />
    ),
  }
)

interface Props {
  value: string
  onChange: (val: string) => void
  height?: number
}

export function MarkdownEditor({ value, onChange, height = 520 }: Props) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={v => onChange(v ?? '')}
        height={height}
        preview="live"
        visibleDragbar={false}
        style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      />
    </div>
  )
}
