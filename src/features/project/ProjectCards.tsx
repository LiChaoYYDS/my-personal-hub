'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ProjectFrontmatter } from '@/types'

interface Project { slug: string; frontmatter: ProjectFrontmatter }

export function ProjectCards({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <p className="text-sm text-muted">暂无项目，敬请期待。</p>

  // 按 group 分组
  const groups = projects.reduce<Record<string, Project[]>>((acc, p) => {
    const g = p.frontmatter.group ?? '其他'
    ;(acc[g] ??= []).push(p)
    return acc
  }, {})

  return (
    <div className="space-y-12">
      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted">{group}</h2>
          <div className="grid gap-4">
            {items.map((p, i) => {
              const fm = p.frontmatter
              return (
                <motion.div key={p.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
                  className="card-glass p-5 space-y-3 hover:border-accent/40 transition-colors">

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {fm.icon && <span className="text-xl">{fm.icon}</span>}
                      <Link href={`/projects/${p.slug}`}
                        className="text-sm font-semibold hover:text-accent transition-colors">
                        {fm.title}
                      </Link>
                      {fm.year && (
                        <span className="text-[10px] text-muted border border-border rounded-full px-2 py-0.5">{fm.year}</span>
                      )}
                    </div>
                    <div className="flex gap-3 shrink-0">
                      {fm.github && (
                        <a href={fm.github} target="_blank" rel="noopener noreferrer"
                          className="group/l text-xs text-muted hover:text-text transition-colors relative">
                          GitHub
                          <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover/l:w-full transition-all duration-200" />
                        </a>
                      )}
                      {fm.demo && (
                        <a href={fm.demo} target="_blank" rel="noopener noreferrer"
                          className="group/l text-xs text-accent font-medium relative">
                          Demo →
                          <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover/l:w-full transition-all duration-200" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed">{fm.description}</p>

                  {fm.tech?.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {fm.tech.map(t => (
                        <span key={t} className="text-[11px] text-muted bg-white/50 border border-white/60 rounded-full px-2.5 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
