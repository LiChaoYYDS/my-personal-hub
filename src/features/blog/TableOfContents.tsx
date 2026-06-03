'use client'
import { useEffect, useState } from 'react'

interface Heading { id: string; text: string; level: number }

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-80px 0px -60% 0px' }
    )
    document.querySelectorAll('h2,h3').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  if (!headings.length) return null

  return (
    <nav className="space-y-1">
      <p className="text-xs uppercase tracking-widest text-muted mb-3">目录</p>
      {headings.map(h => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`block text-xs py-0.5 transition-colors ${h.level === 3 ? 'pl-3' : ''} ${
            active === h.id ? 'text-accent' : 'text-muted hover:text-text'
          }`}
        >
          {h.text}
        </a>
      ))}
    </nav>
  )
}
