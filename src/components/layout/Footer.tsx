import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg mt-0">
      <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <p className="text-xs text-muted">© {new Date().getFullYear()} ChaoBlog</p>
        <div className="flex gap-6">
          <Link href="/blog" className="text-xs text-muted hover:text-text transition-colors">Blog</Link>
          <Link href="/projects" className="text-xs text-muted hover:text-text transition-colors">Projects</Link>
          <a href="https://github.com/LiChaoYYDS" target="_blank" rel="noopener noreferrer"
            className="text-xs text-muted hover:text-text transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  )
}
