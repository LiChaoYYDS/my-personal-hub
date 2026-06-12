'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

interface Props { content: string }

export function ProjectMarkdown({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        h1: ({ children }) => {
          const id = String(children).toLowerCase().replace(/[^\w一-龥]+/g, '-')
          return <h1 id={id}>{children}</h1>
        },
        h2: ({ children }) => {
          const id = String(children).toLowerCase().replace(/[^\w一-龥]+/g, '-')
          return <h2 id={id}>{children}</h2>
        },
        h3: ({ children }) => {
          const id = String(children).toLowerCase().replace(/[^\w一-龥]+/g, '-')
          return <h3 id={id}>{children}</h3>
        },
        h4: ({ children }) => {
          const id = String(children).toLowerCase().replace(/[^\w一-龥]+/g, '-')
          return <h4 id={id}>{children}</h4>
        },
        // 代码块加语言标签
        pre: ({ children, ...props }) => (
          <pre {...props} className="relative rounded-xl overflow-hidden my-4">
            {children}
          </pre>
        ),
        // 行内代码
        code: ({ inline, children, ...props }: any) =>
          inline ? (
            <code {...props} className="bg-slate-100 text-rose-600 px-1.5 py-0.5 rounded text-[0.85em] font-mono">
              {children}
            </code>
          ) : (
            <code {...props}>{children}</code>
          ),
        // 引用块
        blockquote: ({ children }) => (
          <blockquote className="border-l-[3px] border-indigo-400 bg-indigo-50/60 rounded-r-xl pl-4 pr-3 py-3 my-4 italic text-slate-600">
            {children}
          </blockquote>
        ),
        // 图片
        img: ({ src, alt }) => (
          <img src={src} alt={alt || ''} className="rounded-xl shadow-md max-w-full my-4 mx-auto block" />
        ),
        // 表格
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="bg-indigo-500 text-white px-4 py-2 text-left font-semibold">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border-b border-gray-100 px-4 py-2">{children}</td>
        ),
        tr: ({ children, ...props }: any) => (
          <tr {...props} className="even:bg-gray-50 hover:bg-indigo-50/40 transition-colors">{children}</tr>
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="text-indigo-500 hover:text-indigo-700 border-b border-transparent hover:border-indigo-400 transition-all">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
