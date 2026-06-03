'use client'
import type { LifeRecord } from '@/types'

function formatShort(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

export function LifeTimeline({ records }: { records: LifeRecord[] }) {
  function scrollTo(id: string) {
    const el = document.getElementById(`life-${id}`)
    if (!el) return
    const target = el.getBoundingClientRect().top + window.scrollY - 100
    const start = window.scrollY
    const dist = target - start
    const duration = 600
    let startTime: number | null = null

    function step(now: number) {
      if (!startTime) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-in-out cubic
      const ease = progress < 0.5
        ? 4 * progress ** 3
        : 1 - (-2 * progress + 2) ** 3 / 2
      window.scrollTo(0, start + dist * ease)
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  if (!records.length) return null

  const groups = records.reduce<Record<string, LifeRecord[]>>((acc, r) => {
    const y = r.createdAt.slice(0, 4)
    ;(acc[y] ??= []).push(r)
    return acc
  }, {})

  return (
    <aside className="w-64 shrink-0 sticky top-20">
      <div className="card-glass p-5 space-y-4">
        <p className="text-sm font-semibold text-text">时间线</p>
        <div className="relative pl-4">
          <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />
          {Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a)).map(([year, items]) => (
            <div key={year} className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-accent shrink-0 relative z-10 -ml-[1px]" />
                <span className="text-sm font-semibold text-text">{year}</span>
              </div>
              <div className="space-y-2 pl-1">
                {items.map(r => (
                  <button key={r.id} onClick={() => scrollTo(r.id)}
                    className="flex items-start gap-2.5 text-left w-full group transition-all duration-200 rounded-md px-1.5 py-1 hover:bg-bg-subtle">
                    <span className="w-2 h-2 rounded-full bg-border group-hover:bg-accent mt-1.5 shrink-0 transition-colors duration-200" />
                    <div className="min-w-0">
                      <p className="text-xs text-secondary group-hover:text-accent transition-colors duration-200 line-clamp-1 leading-snug">
                        {r.content.slice(0, 22)}…
                      </p>
                      <p className="text-[11px] text-muted mt-0.5">{formatShort(r.createdAt)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

