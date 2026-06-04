'use client'
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Props {
  value: string
  onChange: (val: string) => void
  height?: number
}

export function MarkdownEditor({ value, onChange, height = 520 }: Props) {
  return (
    <div data-color-mode="light" className="md-editor-wrapper">
      <MDEditor
        value={value}
        onChange={v => onChange(v ?? '')}
        height={height}
        preview="live"
        hideToolbar={false}
        visibleDragbar={false}
      />
    </div>
  )
}
