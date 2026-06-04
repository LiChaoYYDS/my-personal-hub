import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const posts = await prisma.blogPost.findMany({
    select: { slug: true, title: true, published: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  console.log('=== BlogPost slugs in DB ===')
  posts.forEach(p => {
    console.log(`slug: ${JSON.stringify(p.slug)} | published: ${p.published} | title: ${p.title}`)
  })
  console.log(`Total: ${posts.length}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
