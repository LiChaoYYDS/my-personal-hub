import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const prisma = new PrismaClient()

async function main() {
  const dir = path.join(process.cwd(), 'src/content/projects')
  if (!fs.existsSync(dir)) {
    console.log('No projects directory found, skipping seed.')
    return
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))
  console.log(`Found ${files.length} project files to migrate.`)

  for (const file of files) {
    const slug = file.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
    const { data, content } = matter(raw)

    const existing = await prisma.project.findUnique({ where: { slug } })
    if (existing) {
      console.log(`  Skipping ${slug} (already exists)`)
      continue
    }

    await prisma.project.create({
      data: {
        slug,
        title: data.title || slug,
        description: data.description || '',
        content: content || '',
        tech: data.tech || [],
        github: data.github || '',
        demo: data.demo || '',
        published: data.published !== false,
        year: data.year || '',
        groupText: data.group || '其他',
        icon: data.icon || '',
        attachments: JSON.stringify(data.attachments || []),
      },
    })
    console.log(`  Migrated ${slug}`)
  }

  console.log('Seed complete.')
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
