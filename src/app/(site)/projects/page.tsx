import { Container } from '@/components/layout/Container'
import { PageTransition, FadeUp } from '@/components/ui/motion'
import { ProjectCards } from '@/features/project/ProjectCards'
import { prisma } from '@/lib/prisma'
import type { ProjectFrontmatter } from '@/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Projects', description: '项目展示' }

export default async function ProjectsPage() {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  const projects = rows.map(p => ({
    slug: p.slug,
    frontmatter: {
      title: p.title,
      description: p.description,
      tech: p.tech,
      github: p.github,
      demo: p.demo,
      published: p.published,
      year: p.year,
      group: p.group,
      icon: p.icon,
    } as ProjectFrontmatter,
  }))

  return (
    <PageTransition>
      <Container className="py-16 space-y-12">
        <FadeUp>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gradient">Projects</h1>
            <p className="text-secondary text-sm">我做过的东西。</p>
          </div>
        </FadeUp>
        <ProjectCards projects={projects} />
      </Container>
    </PageTransition>
  )
}
