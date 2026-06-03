// 内存限流，适合单实例个人站。多实例部署时换 Redis 方案。
interface RateLimitEntry { count: number; resetAt: number }
const store = new Map<string, RateLimitEntry>()

/**
 * @param key    限流 key（建议用 ip + route）
 * @param limit  时间窗口内最大请求数
 * @param windowMs 时间窗口毫秒数
 * @returns true = 允许，false = 超限
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}
