import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => {
    const id = String(children).toLowerCase().replace(/[^\w一-龥]+/g, '-')
    return <h2 id={id} {...props}>{children}</h2>
  },
  h3: ({ children, ...props }) => {
    const id = String(children).toLowerCase().replace(/[^\w一-龥]+/g, '-')
    return <h3 id={id} {...props}>{children}</h3>
  },
  pre: ({ children, ...props }) => (
    <pre {...props} className="overflow-x-auto rounded-md p-4 text-sm">{children}</pre>
  ),
}
