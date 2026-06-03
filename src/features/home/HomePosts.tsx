'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { PostFrontmatter } from '@/types'

interface Props {
  posts: { slug: string; frontmatter: PostFrontmatter }[]
}

export function HomePosts({ posts }: Props) {
  return (
    <section className="space-y-3">
      {posts.map((post, i) => (
        <motion.div key={post.slug}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
        >
          <Link href={`/blog/${post.slug}`}
            className="card-glass flex overflow-hidden hover:border-accent/40 hover:shadow-md transition-all group">
            <div className="w-44 h-28 shrink-0 bg-gradient-to-br from-sky-100 to-blue-200 overflow-hidden">
              <Image
                src={(post.frontmatter as any).cover ?? `https://picsum.photos/seed/${post.slug}/176/112`}
                alt={post.frontmatter.title} width={176} height={112}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-4 space-y-1.5">
              <p className="text-sm font-semibold text-text group-hover:text-accent transition-colors line-clamp-2">{post.frontmatter.title}</p>
              <p className="text-xs text-muted">发表于 {post.frontmatter.date}</p>
              {post.frontmatter.summary && (
                <p className="text-xs text-secondary line-clamp-2 leading-relaxed">{post.frontmatter.summary}</p>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
      <Link href="/blog" className="block text-xs text-muted hover:text-accent transition-colors pt-1">查看全部文章 →</Link>
    </section>
  )
}
