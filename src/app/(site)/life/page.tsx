import { Sidebar } from '@/components/layout/Sidebar'
import { LifeClientLayout } from '@/features/life/LifeClientLayout'

export const metadata = { title: '生活', description: '生活记录' }

export default function LifePage() {
  return (
    <>
      <div className="relative w-full h-52 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1600&auto=format&fit=crop')" }} />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">生活</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6 flex gap-6 items-start">
        <LifeClientLayout />
        <Sidebar />
      </div>
    </>
  )
}
