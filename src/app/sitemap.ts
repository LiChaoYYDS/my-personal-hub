import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().filter(p => p.frontmatter.published).map(p => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.frontmatter.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/projects`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/life`, changeFrequency: 'daily', priority: 0.6 },
    ...posts,
  ]
}
