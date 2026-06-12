import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD required')

  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.upsert({
    where: { email },
    update: { password: hashed },
    create: { id: randomUUID(), email, password: hashed },
  })
  console.log('Admin account ready:', email)
}

main().finally(() => prisma.$disconnect())
