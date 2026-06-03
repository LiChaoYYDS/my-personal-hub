'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function ReadingProgress() {
  const [width, setWidth] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    setWidth(0)
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      setWidth(total > 0 ? (scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [pathname])

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-[60] bg-transparent">
      <div className="h-full bg-accent transition-[width] duration-75 ease-out"
        style={{ width: `${width}%` }} />
    </div>
  )
}
