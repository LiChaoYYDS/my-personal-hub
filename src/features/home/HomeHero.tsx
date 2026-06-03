'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { StaggerList, StaggerItem } from '@/components/ui/motion'

const ROLES = ['全栈开发者', 'AI 实践者', '创作者']

function TypewriterRoles() {
  const [idx, setIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const target = ROLES[idx % ROLES.length]
    let timer: ReturnType<typeof setTimeout>

    if (!deleting && displayed.length < target.length) {
      timer = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === target.length) {
      timer = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setIdx(i => i + 1)
    }
    return () => clearTimeout(timer)
  }, [displayed, deleting, idx])

  return (
    <span className="text-accent">
      {displayed}<span className="cursor-blink">|</span>
    </span>
  )
}

const TECH_STACK = [
  'Next.js', 'TypeScript', 'React', 'TailwindCSS', 'Framer Motion',
  'PostgreSQL', 'Prisma', 'Node.js', 'Python', 'Docker', 'AI / LLM', 'Claude API',
]

export function HomeHero() {
  return (
    <StaggerList className="space-y-10">
      {/* Avatar + Name */}
      <StaggerItem>
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/80 shadow-md">
              <Image
                src="https://api.dicebear.com/8.x/notionists/svg?seed=hub&backgroundColor=b6e3f4"
                alt="avatar"
                width={64}
                height={64}
                className="w-full h-full object-cover bg-indigo-100"
                unoptimized
              />
            </div>
            <span className="absolute -bottom-1 -right-1 text-base">👋</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gradient">Your Name</h1>
            <p className="text-sm text-secondary mt-0.5">Building AI & Digital Tools</p>
          </div>
        </div>
      </StaggerItem>

      {/* Typewriter slogan */}
      <StaggerItem>
        <p className="text-3xl font-semibold tracking-tight leading-snug">
          <TypewriterRoles />
        </p>
        <p className="text-secondary mt-3 max-w-lg leading-relaxed text-sm">
          专注于 AI 工程、全栈开发与产品设计。这里记录我的思考、项目与生活。
        </p>
      </StaggerItem>

      {/* CTA */}
      <StaggerItem>
        <div className="flex gap-3">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link href="/blog"
              className="inline-flex items-center gap-1.5 rounded-full bg-text px-5 py-2 text-sm text-bg hover:opacity-80 transition-opacity font-medium">
              阅读文章
            </Link>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link href="/about"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/60 backdrop-blur-sm px-5 py-2 text-sm text-secondary hover:text-text transition-colors">
              了解我
            </Link>
          </motion.div>
        </div>
      </StaggerItem>

      {/* Tech stack cloud */}
      <StaggerItem>
        <div className="space-y-2">
          <p className="text-xs text-muted uppercase tracking-widest">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {TECH_STACK.map(t => (
              <span key={t}
                className="text-xs text-secondary bg-white/70 backdrop-blur-sm border border-white/50 rounded-full px-3 py-1 hover:border-accent/40 hover:text-accent transition-colors">
                {t}
              </span>
            ))}
          </div>
        </div>
      </StaggerItem>
    </StaggerList>
  )
}
