import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken, setSessionCookie } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !await bcrypt.compare(password, user.password)) {
    return NextResponse.json({ success: false, message: '邮箱或密码错误' }, { status: 401 })
  }
  const token = await signToken({ userId: user.id })
  await setSessionCookie(token)
  return NextResponse.json({ success: true, data: null, message: '' })
}
