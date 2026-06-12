'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

function extractText(node: unknown): string {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node && typeof node === 'object' && 'props' in (node as any))
    return extractText((node as any).props?.children)
  return ''
}

function makeId(children: unknown) {
  return extractText(children).toLowerCase().replace(/[^\w一-龥]+/g, '-').replace(/^-|-$/g, '')
}

const components = {
  h1: ({ children }: any) => <h1 id={makeId(children)}>{children}</h1>,
  h2: ({ children }: any) => <h2 id={makeId(children)}>{children}</h2>,
  h3: ({ children }: any) => <h3 id={makeId(children)}>{children}</h3>,
  h4: ({ children }: any) => <h4 id={makeId(children)}>{children}</h4>,
}

export function ProjectMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>
      {content}
    </ReactMarkdown>
  )
}
