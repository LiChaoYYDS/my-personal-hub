'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ProjectFrontmatter } from '@/types'

interface Props {
  projects: { slug: string; frontmatter: ProjectFrontmatter | any }[]
}

export function HomeProjects({ projects }: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-xs uppercase tracking-widest text-muted">Selected Work</h2>
      <div className="space-y-4">
        {projects.map((p, i) => {
          const fm = p.frontmatter as ProjectFrontmatter
          return (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: 'easeOut' }}
              className="card-glass rounded-md p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium">{fm.title}</p>
                <div className="flex gap-3 shrink-0">
                  {fm.github && (
                    <a href={fm.github} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-muted hover:text-text transition-colors underline-grow">GitHub</a>
                  )}
                  {fm.demo && (
                    <a href={fm.demo} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-muted hover:text-text transition-colors underline-grow">Demo →</a>
                  )}
                </div>
              </div>
              <p className="text-xs text-secondary leading-relaxed">{fm.description}</p>
              {fm.tech?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {fm.tech.map((t: string) => (
                    <span key={t} className="text-xs text-muted border border-border rounded-sm px-2 py-0.5">{t}</span>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
      <Link href="/projects" className="text-xs text-muted hover:text-text transition-colors">所有项目 →</Link>
    </section>
  )
}
