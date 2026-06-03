'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message { role: 'user' | 'assistant'; content: string }

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    if (!input.trim() || streaming) return
    const userMsg: Message = { role: 'user', content: input }
    const next = [...messages, userMsg]
    setMessages([...next, { role: 'assistant', content: '' }])
    setInput('')
    setStreaming(true)

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: next }),
    })

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      for (const line of decoder.decode(value).split('\n').filter(l => l.startsWith('data: '))) {
        const data = line.slice(6)
        if (data === '[DONE]') break
        const { text } = JSON.parse(data)
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: updated[updated.length - 1].content + text }
          return updated
        })
      }
    }
    setStreaming(false)
  }

  return (
    <>
      {/* 悬浮按钮 */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.08 }}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-text text-bg flex items-center justify-center shadow-md z-50 text-sm"
        aria-label="AI 助手"
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {open ? '×' : '✦'}
        </motion.span>
      </motion.button>

      {/* 聊天窗口 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-20 right-6 w-80 h-96 border border-border rounded-lg card-glass shadow-md flex flex-col z-50"
          >
            <div className="px-4 py-3 border-b border-border text-sm font-medium">AI 助手</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-xs text-muted text-center pt-6">你好，有什么想了解的？</p>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`text-xs leading-relaxed ${msg.role === 'user' ? 'text-right' : ''}`}
                >
                  <span className={`inline-block px-3 py-2 rounded-md max-w-[85%] ${
                    msg.role === 'user' ? 'bg-text text-bg' : 'bg-bg-subtle text-text border border-border'
                  }`}>
                    {msg.content || <span className="opacity-40">...</span>}
                  </span>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="px-3 py-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="输入问题..."
                disabled={streaming}
                className="flex-1 text-xs bg-bg-subtle border border-border rounded-sm px-3 py-1.5 outline-none focus:border-accent disabled:opacity-50"
              />
              <motion.button
                onClick={send}
                disabled={streaming || !input.trim()}
                whileTap={{ scale: 0.95 }}
                className="text-xs bg-text text-bg rounded-sm px-3 py-1.5 hover:opacity-80 disabled:opacity-40 transition-opacity"
              >
                发
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
