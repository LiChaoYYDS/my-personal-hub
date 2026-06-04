'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { BytemdPlugin } from 'bytemd'
import 'bytemd/dist/index.css'
import 'highlight.js/styles/github.css'

const Editor = dynamic(
  () => import('@bytemd/react').then(m => m.Editor),
  { ssr: false, loading: () => <div className="bg-gray-50 rounded-xl border border-border animate-pulse" style={{ height: 520 }} /> }
)

interface Props {
  value: string
  onChange: (val: string) => void
  height?: number
}

export function MarkdownEditor({ value, onChange, height = 520 }: Props) {
  const [plugins, setPlugins] = useState<BytemdPlugin[]>([])

  useEffect(() => {
    Promise.all([
      import('@bytemd/plugin-gfm').then(m => m.default()),
      import('@bytemd/plugin-highlight').then(m => m.default()),
    ]).then(setPlugins)
  }, [])

  return (
    <div style={{ height }} className="bytemd-wrapper rounded-xl overflow-hidden border border-border shadow-sm">
      <Editor value={value} onChange={onChange} plugins={plugins} />
    </div>
  )
}
