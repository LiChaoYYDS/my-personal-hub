import { getAllProjects } from '@/lib/mdx'
import { Container } from '@/components/layout/Container'
import { PageTransition, FadeUp } from '@/components/ui/motion'
import { ProjectCards } from '@/features/project/ProjectCards'
import type { ProjectFrontmatter } from '@/types'

export const metadata = { title: 'Projects', description: '项目展示' }

export default function ProjectsPage() {
  let projects: ReturnType<typeof getAllProjects> = []
  try { projects = getAllProjects() } catch { projects = [] }

  const published = projects
    .filter(p => (p.frontmatter as ProjectFrontmatter).published !== false)
    .map(p => ({ slug: p.slug, frontmatter: p.frontmatter as ProjectFrontmatter }))

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
