'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchResult { slug: string; title: string; reason: string }

export function SearchContent() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true); setSearched(true)
    const res = await fetch('/api/ai/search', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    const data = await res.json()
    setResults(data.data ?? [])
    setLoading(false)
  }

  return (
    <main className="flex-1 min-w-0 space-y-4">
      <div className="card-glass p-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="输入关键词搜索文章，例如：Next.js、AI、全栈开发..."
            className="flex-1 border border-border rounded-md px-4 py-2.5 text-sm bg-bg outline-none focus:border-accent transition-colors" />
          <motion.button type="submit" disabled={loading || !query.trim()}
            whileTap={{ scale: 0.97 }}
            className="bg-accent text-white rounded-md px-6 py-2.5 text-sm font-medium hover:bg-accent-hover disabled:opacity-40 transition-colors shrink-0">
            {loading ? '搜索中...' : '搜索'}
          </motion.button>
        </form>
      </div>

      <AnimatePresence>
        {searched && !loading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-3">
            {results.length === 0 ? (
              <div className="card-glass p-8 text-center">
                <p className="text-sm text-muted">未找到相关文章，换个关键词试试？</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted px-2">找到 {results.length} 篇相关文章</p>
                {results.map((r, i) => (
                  <motion.div key={r.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}>
                    <Link href={`/blog/${r.slug}`}
                      className="card-glass p-5 block hover:border-accent/40 hover:shadow-md transition-all group space-y-2">
                      <h3 className="text-base font-semibold text-text group-hover:text-accent transition-colors">{r.title}</h3>
                      <p className="text-sm text-secondary leading-relaxed">{r.reason}</p>
                      <div className="flex items-center gap-2 text-xs text-muted pt-1">
                        <span>💡 推荐理由</span><span>·</span><span className="text-accent">查看详情 →</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!searched && (
        <div className="card-glass p-8 text-center space-y-3">
          <p className="text-2xl">🔍</p>
          <p className="text-sm text-secondary">输入关键词开始搜索</p>
          <p className="text-xs text-muted">支持自然语言搜索，AI 会为你推荐最相关的文章</p>
        </div>
      )}
    </main>
  )
}
