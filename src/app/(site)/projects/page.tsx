import { Container } from '@/components/layout/Container'
import { PageTransition, FadeUp } from '@/components/ui/motion'
import { ProjectCards } from '@/features/project/ProjectCards'
import type { ProjectFrontmatter } from '@/types'

export const metadata = { title: 'Projects', description: '项目展示' }

async function getProjects(): Promise<{ slug: string; frontmatter: ProjectFrontmatter }[]> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const res = await fetch(base + '/api/projects', { cache: 'no-store' })
    const json = await res.json()
    if (!json.success) return []
    return json.data
      .filter((p: any) => p.published !== false)
      .map((p: any) => ({
        slug: p.slug,
        frontmatter: {
          title: p.title,
          description: p.description,
          tech: p.tech,
          github: p.github,
          demo: p.demo,
          published: p.published,
          year: p.year || '',
          group: p.groupText || '其他',
          icon: p.icon || '',
          attachments: p.attachments ? JSON.parse(p.attachments) : [],
        } as ProjectFrontmatter,
      }))
  } catch { return [] }
}

export default async function ProjectsPage() {
  const published = await getProjects()

  return (
    <PageTransition>
      <Container className="py-16 space-y-12">
        <FadeUp>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gradient">Projects</h1>
            <p className="text-secondary text-sm">我做过的东西。</p>
          </div>
        </FadeUp>
        <ProjectCards projects={published} />
      </Container>
    </PageTransition>
  )
}
