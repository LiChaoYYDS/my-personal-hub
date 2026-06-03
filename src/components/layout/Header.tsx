'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'

const nav = [
  { label: '搜索', href: '/search', icon: '🔍' },
  { label: '首页', href: '/', icon: '🏠' },
  { label: '文章归档', href: '/blog', icon: '📋' },
  { label: '项目', href: '/projects', icon: '📁' },
  { label: '生活记录', href: '/life', icon: '🏷️' },
  { label: '关于', href: '/about', icon: '❤️' },
]

export function Header() {
  const path = usePathname()
  const isHome = path === '/'

  return (
    <header className={`z-50 ${isHome
      ? 'absolute top-0 inset-x-0 bg-transparent border-none'
      : 'sticky top-0 bg-bg border-b border-border shadow-sm'
    }`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/"
          className={`flex items-center gap-1.5 font-bold text-lg tracking-tight transition-colors
            ${isHome ? 'text-white hover:text-white/80' : 'text-text hover:text-accent'}`}>
          <span className="text-accent font-black">Chao</span><span>Blog</span>
        </Link>

        <nav className="flex items-center gap-1">
          {nav.map(n => {
            const active = n.href === '/' ? path === '/' : path.startsWith(n.href)
            return (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors
                  ${isHome
                    ? active ? 'text-white font-medium' : 'text-white/80 hover:text-white hover:bg-white/10'
                    : active ? 'text-accent font-medium' : 'text-secondary hover:text-text hover:bg-bg-subtle'
                  }`}>
                <span className="text-xs">{n.icon}</span>
                {n.label}
              </Link>
            )
          })}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
