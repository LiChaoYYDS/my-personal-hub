'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

function makeId(text: unknown) {
  return String(text).toLowerCase().replace(/[^\w一-龥]+/g, '-').replace(/^-|-$/g, '')
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
