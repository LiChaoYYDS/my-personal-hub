'use client'
import { useState, useEffect } from 'react'

const ROLES = ['全栈开发者', 'AI 实践者', '创作者']

function Typewriter() {
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const target = ROLES[idx % ROLES.length]
    const timer = setTimeout(() => {
      if (!deleting && text.length < target.length) {
        setText(target.slice(0, text.length + 1))
      } else if (!deleting && text.length === target.length) {
        setTimeout(() => setDeleting(true), 1800)
      } else if (deleting && text.length > 0) {
        setText(text.slice(0, -1))
      } else {
        setDeleting(false)
        setIdx(i => i + 1)
      }
    }, deleting ? 45 : 80)
    return () => clearTimeout(timer)
  }, [text, deleting, idx])

  return <span>{text}<span className="cursor-blink">|</span></span>
}

export function HomeBanner() {
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* 背景图 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&auto=format&fit=crop')" }}
      />
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/20" />

      {/* 居中文字 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
        <h1 className="text-4xl font-bold mb-3 drop-shadow-md">个人空间</h1>
        <p className="text-lg text-white/90 drop-shadow"><Typewriter /></p>
      </div>

      {/* 向下箭头 */}
      <button
        onClick={() => window.scrollTo({ top: 620, behavior: 'smooth' })}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce text-2xl"
        aria-label="向下滚动"
      >∨</button>
    </div>
  )
}
