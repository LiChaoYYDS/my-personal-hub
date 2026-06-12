import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const rows = await prisma.project.findMany({
  where: { published: true },
  orderBy: { createdAt: 'desc' },
})
console.log('项目数量:', rows.length)
if (rows[0]) console.log('字段名:', Object.keys(rows[0]).join(', '))
rows.forEach(p => console.log(' "' + p.title + '" groupText="' + p.groupText + '"'))
await prisma.$disconnect()
