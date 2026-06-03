'use client'
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Props {
  value: string
  onChange: (val: string) => void
  rows?: number
}

export function MarkdownEditor({ value, onChange, rows = 16 }: Props) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={v => onChange(v ?? '')}
        height={rows * 22}
        preview="live"
      />
    </div>
  )
}
