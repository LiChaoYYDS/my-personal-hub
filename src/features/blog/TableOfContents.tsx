'use client'
import { useEffect, useState } from 'react'

interface Heading { id: string; text: string; level: number }

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const els = document.querySelectorAll('h1[id],h2[id],h3[id],h4[id]')
    if (!els.length) return
    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) { setActive(e.target.id); break }
        }
      },
      { rootMargin: '-72px 0px -70% 0px', threshold: 0 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  if (!headings.length) return null

  const indent: Record<number, string> = { 1: '', 2: '', 3: 'pl-3', 4: 'pl-6' }
  const size:   Record<number, string> = { 1: 'text-xs font-semibold', 2: 'text-xs font-medium', 3: 'text-xs', 4: 'text-[11px]' }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
    setActive(id)
  }

  return (
    <nav className="space-y-0.5">
      <p className="text-xs font-semibold text-text mb-3 flex items-center gap-1.5">
        <span>📋</span> 目录
      </p>
      {headings.map(h => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={e => handleClick(e, h.id)}
          className={`
            flex items-center gap-2 py-1 rounded-md px-2 transition-all duration-150
            ${indent[h.level] ?? ''}
            ${size[h.level] ?? 'text-xs'}
            ${active === h.id
              ? 'text-accent bg-indigo-50 border-l-2 border-accent'
              : 'text-secondary hover:text-text hover:bg-gray-50'
            }
          `}
        >
          {h.text}
        </a>
      ))}
    </nav>
  )
}
