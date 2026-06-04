import type { MDXComponents } from 'mdx/types'
import { CopyButton } from './CopyButton'

function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(extractText).join('')
  if (children && typeof children === 'object' && 'props' in (children as any)) {
    return extractText((children as any).props.children)
  }
  return ''
}

export const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => {
    const id = String(children).toLowerCase().replace(/[^\w一-龥]+/g, '-')
    return <h2 id={id} {...props}>{children}</h2>
  },
  h3: ({ children, ...props }) => {
    const id = String(children).toLowerCase().replace(/[^\w一-龥]+/g, '-')
    return <h3 id={id} {...props}>{children}</h3>
  },
  // rehype-pretty-code 生成的结构: <figure data-rehype-pretty-code-figure>
  figure: ({ children, ...props }: any) => {
    const isCode = props['data-rehype-pretty-code-figure'] !== undefined
    if (!isCode) return <figure {...props}>{children}</figure>

    // 提取语言名和代码文本
    const childArr = Array.isArray(children) ? children : [children]
    const caption = childArr.find((c: any) => c?.type === 'figcaption')
    const pre = childArr.find((c: any) => c?.type === 'pre')
    const lang = caption?.props?.['data-language'] ?? ''
    const codeText = extractText(pre)

    return (
      <figure className="my-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm" {...props}>
        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {lang || 'code'}
          </span>
          <CopyButton text={codeText} />
        </div>
        {pre}
      </figure>
    )
  },
  pre: ({ children, ...props }: any) => (
    <pre {...props}
      className="overflow-x-auto p-4 text-sm leading-relaxed bg-gray-50 dark:bg-gray-900 m-0">
      {children}
    </pre>
  ),
}
