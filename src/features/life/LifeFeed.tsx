'use client'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { LifeRecord } from '@/types'

const SAMPLE: LifeRecord[] = [
  { id: 's1', content: '开始搭建这个个人数字中台，用 Next.js + MDX + PostgreSQL，终于有了一个真正属于自己的空间。', images: ['https://picsum.photos/seed/life1/400/400', 'https://picsum.photos/seed/life2/400/400', 'https://picsum.photos/seed/life3/400/400'], location: '上海', mood: '😊', createdAt: '2026-06-01T10:00:00Z' },
  { id: 's2', content: '读完了《Building a Second Brain》，决定把笔记系统和博客打通，让知识流动起来。', images: [], location: undefined, mood: '📚', createdAt: '2026-05-28T14:30:00Z' },
  { id: 's3', content: '和朋友去了一趟杭州，西湖边喝茶，聊 AI 的未来，有点反乌托邦，但很有意思。', images: ['https://picsum.photos/seed/life4/400/400', 'https://picsum.photos/seed/life5/400/400'], location: '杭州', mood: '🌿', createdAt: '2026-05-20T09:00:00Z' },
  { id: 's4', content: '用 Claude API 做了一个小工具，把我的 Notion 笔记自动总结成摘要卡片，省了不少时间。', images: ['https://picsum.photos/seed/life6/400/400'], mood: '⚡', createdAt: '2026-05-15T16:00:00Z' },
  { id: 's5', content: '今天无所事事，但在咖啡馆里把积压的 RSS 全读完了，感觉大脑被清空又填满了。', images: [], location: '北京', mood: '☕', createdAt: '2026-05-10T11:00:00Z' },
]

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = (now.getTime() - d.getTime()) / 1000
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} 天前`
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

function ImageGrid({ images, onClickImage }: { images: string[]; onClickImage: (idx: number) => void }) {
  const n = images.length
  if (n === 0) return null
  const cols = n === 1 ? 'grid-cols-1' : n === 2 || n === 4 ? 'grid-cols-2' : 'grid-cols-3'
  const maxW = n === 1 ? 'max-w-[260px]' : ''
  return (
    <div className={`grid gap-1 mt-2 ${cols} ${maxW}`}>
      {images.map((img, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded-md cursor-pointer bg-bg-subtle"
          onClick={() => onClickImage(i)}>
          <Image src={img} alt="" fill className="object-cover hover:scale-105 transition-transform duration-200" unoptimized />
        </div>
      ))}
    </div>
  )
}

function Lightbox({ images, index, onClose, onPrev, onNext }: {
  images: string[]; index: number
  onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl">✕</button>
      {images.length > 1 && <>
        <button onClick={e => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 text-white/70 hover:text-white text-3xl px-3 py-2">‹</button>
        <button onClick={e => { e.stopPropagation(); onNext() }}
          className="absolute right-4 text-white/70 hover:text-white text-3xl px-3 py-2">›</button>
      </>}
      <img src={images[index]} alt="" className="max-h-[90vh] max-w-[90vw] object-contain rounded"
        onClick={e => e.stopPropagation()} />
      <p className="absolute bottom-4 text-white/50 text-sm">{index + 1} / {images.length}</p>
    </motion.div>
  )
}

function DetailModal({ record, onClose }: { record: LifeRecord; onClose: () => void }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && lightboxIdx === null && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose, lightboxIdx])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}
        className="bg-bg rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-accent/20 flex items-center justify-center text-accent font-bold">
              我
            </div>
            <div>
              <p className="text-sm font-semibold text-text">Your Name</p>
              <p className="text-xs text-muted">{formatTime(record.createdAt)}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-text text-lg">✕</button>
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap text-text">{record.content}</p>

        {record.images.length > 0 && (
          <ImageGrid images={record.images} onClickImage={setLightboxIdx} />
        )}

        <div className="flex items-center gap-3 text-xs text-muted pt-1 border-t border-border">
          {record.mood && <span>{record.mood}</span>}
          {record.location && <span>📍 {record.location}</span>}
          <span className="ml-auto">{new Date(record.createdAt).toLocaleString('zh-CN')}</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox images={record.images} index={lightboxIdx} onClose={() => setLightboxIdx(null)}
            onPrev={() => setLightboxIdx(i => Math.max(0, (i ?? 0) - 1))}
            onNext={() => setLightboxIdx(i => Math.min(record.images.length - 1, (i ?? 0) + 1))}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function MomentCard({ record, onClick }: { record: LifeRecord; onClick: () => void }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  return (
    <>
      <div className="card-glass p-4 space-y-3">
        {/* 头部 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-accent/20 flex items-center justify-center text-accent font-bold text-sm shrink-0">
            我
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text">Your Name</p>
            <p className="text-xs text-muted">{formatTime(record.createdAt)}</p>
          </div>
          {record.mood && <span className="text-xl">{record.mood}</span>}
        </div>

        {/* 内容 */}
        <p className="text-sm leading-relaxed text-text cursor-pointer hover:text-accent transition-colors line-clamp-4"
          onClick={onClick}>
          {record.content}
        </p>

        {/* 图片网格 */}
        {record.images.length > 0 && (
          <ImageGrid images={record.images} onClickImage={setLightboxIdx} />
        )}

        {/* 底部 meta */}
        {record.location && (
          <p className="text-xs text-muted">📍 {record.location}</p>
        )}
      </div>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox images={record.images} index={lightboxIdx} onClose={() => setLightboxIdx(null)}
            onPrev={() => setLightboxIdx(i => Math.max(0, (i ?? 0) - 1))}
            onNext={() => setLightboxIdx(i => Math.min(record.images.length - 1, (i ?? 0) + 1))}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export function LifeFeed({ onRecordsLoad }: { onRecordsLoad?: (records: LifeRecord[]) => void }) {
  const [records, setRecords] = useState<LifeRecord[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [detail, setDetail] = useState<LifeRecord | null>(null)

  const fetchPage = useCallback(async (p: number, append = false) => {
    if (p === 1) setLoading(true); else setLoadingMore(true)
    try {
      const res = await fetch(`/api/life?page=${p}`)
      const data = await res.json()
      const items: LifeRecord[] = data.data ?? []
      const next = append
        ? (prev: LifeRecord[]) => { const r = [...prev, ...items]; onRecordsLoad?.(r); return r }
        : () => { const r = items.length ? items : SAMPLE; onRecordsLoad?.(r); return r }
      setRecords(next)
      setHasMore(items.length === 20)
    } catch {
      if (p === 1) { setRecords(SAMPLE); onRecordsLoad?.(SAMPLE) }
    }
    if (p === 1) setLoading(false); else setLoadingMore(false)
  }, [onRecordsLoad])

  useEffect(() => { fetchPage(1) }, [fetchPage])

  if (loading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="card-glass p-4 space-y-3 animate-pulse">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-border" />
            <div className="space-y-1.5">
              <div className="h-3 w-20 bg-border rounded" />
              <div className="h-2 w-14 bg-border rounded" />
            </div>
          </div>
          <div className="h-3 w-3/4 bg-border rounded" />
          <div className="h-3 w-1/2 bg-border rounded" />
        </div>
      ))}
    </div>
  )

  return (
    <>
      <div className="space-y-4">
        {records.map((record, idx) => (
          <motion.div key={record.id} id={`life-${record.id}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}>
            <MomentCard record={record} onClick={() => setDetail(record)} />
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <button onClick={() => { const next = page + 1; setPage(next); fetchPage(next, true) }}
          disabled={loadingMore}
          className="mt-4 w-full text-xs text-muted hover:text-accent transition-colors py-2 disabled:opacity-40">
          {loadingMore ? '加载中...' : '加载更多'}
        </button>
      )}

      <AnimatePresence>
        {detail && <DetailModal record={detail} onClose={() => setDetail(null)} />}
      </AnimatePresence>
    </>
  )
}
