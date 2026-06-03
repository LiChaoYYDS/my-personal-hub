import { Sidebar } from '@/components/layout/Sidebar'
import { SearchContent } from '@/features/search/SearchContent'

export const metadata = { title: '搜索', description: '搜索文章' }

export default function SearchPage() {
  return (
    <>
      <div className="relative w-full h-52 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=1600&auto=format&fit=crop')" }} />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">搜索</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6 flex gap-6 items-start">
        <SearchContent />
        <Sidebar />
      </div>
    </>
  )
}
