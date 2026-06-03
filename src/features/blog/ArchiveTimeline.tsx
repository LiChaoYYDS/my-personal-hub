'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Post { slug: string; title: string; summary: string; date: string }

export function ArchiveTimeline({ posts }: { posts: Post[] }) {
  // 按年分组
  const groups = posts.reduce<Record<string, Post[]>>((acc, p) => {
    const year = p.date?.slice(0, 4) ?? '未知'
    ;(acc[year] ??= []).push(p)
    return acc
  }, {})

  return (
    <div className="card-glass p-8">
      {/* 全部文章标题 */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-4 h-4 rounded-full bg-accent border-2 border-white shadow shrink-0" />
        <h2 className="text-lg font-bold text-text">全部文章 · {posts.length}</h2>
      </div>

      {/* 时间线 */}
      <div className="relative pl-2">
        {/* 竖线 */}
        <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />

        {Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a)).map(([year, yearPosts]) => (
          <div key={year} className="mb-6">
            {/* 年份 */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3.5 h-3.5 rounded-full bg-orange-400 border-2 border-white shadow shrink-0 relative z-10" />
              <span className="text-base font-semibold text-text">{year}</span>
            </div>

            {/* 文章列表 */}
            <div className="space-y-3 ml-2">
              {yearPosts.map((post, i) => (
                <motion.div key={post.slug}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-300 border-2 border-white shadow shrink-0 relative z-10" />
                  <Link href={`/blog/${post.slug}`}
                    className="flex items-center gap-3 flex-1 group hover:bg-bg-subtle rounded-md p-2 -m-2 transition-colors">
                    <div className="w-20 h-14 shrink-0 rounded overflow-hidden bg-bg-subtle">
                      <Image
                        src={`https://picsum.photos/seed/${post.slug}/80/56`}
                        alt={post.title} width={80} height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted mb-0.5">📅 {post.date}</p>
                      <p className="text-sm text-text group-hover:text-accent transition-colors line-clamp-1">{post.title}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
