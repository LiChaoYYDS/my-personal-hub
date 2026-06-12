'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

interface Props { content: string }

// 生成标题 id（与文章详情页 mdxComponents 一致）
function headingId(children: React.ReactNode) {
  return String(children).toLowerCase().replace(/[^\w一-龥]+/g, '-').replace(/^-|-$/g, '')
}

export function ProjectMarkdown({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        // 标题加锚点 id，让 TOC 点击平滑跳转生效
        h1: ({ children }) => <h1 id={headingId(children)}>{children}</h1>,
        h2: ({ children }) => <h2 id={headingId(children)}>{children}</h2>,
        h3: ({ children }) => <h3 id={headingId(children)}>{children}</h3>,
        h4: ({ children }) => <h4 id={headingId(children)}>{children}</h4>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
