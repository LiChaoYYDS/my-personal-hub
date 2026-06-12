'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

// 把 "1. xxx" / "1.1 xxx" 格式内容预处理为标准 Markdown 标题
function normalizeContent(raw: string): string {
  return raw.split('\n').map(line => {
    const t = line.trimEnd()
    const h2 = t.match(/^(\d+)\.\s+([^\d].+)$/)
    if (h2) return `## ${h2[2]}`
    const h3 = t.match(/^(\d+)\.(\d+)\s+(.+)$/)
    if (h3) return `### ${h3[3]}`
    return t
  }).join('\n')
}

function makeId(children: unknown): string {
  const text = extract(children)
  return text.toLowerCase().replace(/[^\w一-龥]+/g, '-').replace(/^-|-$/g, '')
}
function extract(node: unknown): string {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extract).join('')
  if (node && typeof node === 'object' && 'props' in (node as any))
    return extract((node as any).props?.children)
  return ''
}

const components = {
  h2: ({ children }: any) => <h2 id={makeId(children)}>{children}</h2>,
  h3: ({ children }: any) => <h3 id={makeId(children)}>{children}</h3>,
  h4: ({ children }: any) => <h4 id={makeId(children)}>{children}</h4>,
}

export function ProjectMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>
      {normalizeContent(content)}
    </ReactMarkdown>
  )
}
