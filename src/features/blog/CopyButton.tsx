'use client'
import { useState } from 'react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={copy} aria-label="复制代码"
      className="text-xs text-gray-400 hover:text-gray-200 transition-colors px-1.5 py-0.5 rounded">
      {copied ? '✓' : '⎘'}
    </button>
  )
}
