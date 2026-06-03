'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: fd.get('email'), password: fd.get('password') }),
    })
    const data = await res.json()
    if (data.success) router.push('/admin/dashboard')
    else { setError(data.message); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">管理后台</h1>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <input name="email" type="email" placeholder="邮箱" required
          className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-bg outline-none focus:border-accent" />
        <input name="password" type="password" placeholder="密码" required
          className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-bg outline-none focus:border-accent" />
        <button type="submit" disabled={loading}
          className="w-full bg-text text-bg rounded-sm py-2 text-sm hover:opacity-80 disabled:opacity-40 transition-opacity">
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  )
}
