import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ChatWidget } from '@/features/ai/ChatWidget'
import { ReadingProgress } from '@/components/ui/ReadingProgress'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'ChaoBlog', template: '%s · ChaoBlog' },
  description: 'ChaoBlog — 构建 AI 系统、数字产品与个人知识空间。',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: SITE_URL,
    siteName: 'ChaoBlog',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={inter.variable} suppressHydrationWarning>
      <body>
        <ReadingProgress />
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}