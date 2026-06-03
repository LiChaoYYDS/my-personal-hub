'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Post { slug: string; title: string; summary: string; date: string }

export function BlogList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-0">
      {posts.map((post, i) => (
        <motion.div key={post.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05, ease: 'easeOut' }}>
          <Link href={`/blog/${post.slug}`}
            className="group grid grid-cols-[1fr_auto] items-baseline gap-4 py-4 border-b border-border last:border-0
              hover:bg-bg-subtle rounded-sm px-2 -mx-2 transition-colors">
            <div className="space-y-1">
              <p className="text-sm group-hover:text-accent transition-colors">{post.title}</p>
              <p className="text-xs text-muted">{post.summary}</p>
            </div>
            <span className="text-xs text-muted whitespace-nowrap">{post.date}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
