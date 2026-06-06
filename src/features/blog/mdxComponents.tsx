import type { MDXComponents } from 'mdx/types'

function makeId(text: unknown): string {
  return String(text).toLowerCase().replace(/[^\w一-龥]+/g, '-').replace(/^-|-$/g, '')
}

export const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => <h1 id={makeId(children)} {...props}>{children}</h1>,
  h2: ({ children, ...props }) => <h2 id={makeId(children)} {...props}>{children}</h2>,
  h3: ({ children, ...props }) => <h3 id={makeId(children)} {...props}>{children}</h3>,
  h4: ({ children, ...props }) => <h4 id={makeId(children)} {...props}>{children}</h4>,
}
