import { Container } from '@/components/layout/Container'
import { PageTransition, FadeUp, StaggerList, StaggerItem } from '@/components/ui/motion'

export const metadata = { title: 'About', description: '关于我' }

const EXPERIENCE = [
  { year: '2024-12 ~ 2025-06', role: '前端开发', desc: 'Web项目开发与维护，负责页面功能开发、接口联调及基础组件封装工作。' },
  { year: '2026-01 ~ 2026-06', role: '低代码开发', desc: '负责医院人事系统与排班考勤功能模块开发。' },
]

const SKILLS = [
  { label: '前端', tags: ['Vue', 'Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion'] },
  { label: '后端', tags: ['Node.js', 'Python', 'PostgreSQL', 'Prisma', 'Redis'] },
  { label: 'AI / LLM', tags: ['Claude API', 'OpenAI', 'LangChain', 'RAG', 'Prompt Engineering'] },
  { label: '工具链', tags: ['Docker', 'Nginx', 'Git'] },
]

export default function AboutPage() {
  return (
    <PageTransition>
      {/* Banner */}
      <div className="relative w-full h-52 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&auto=format&fit=crop')" }} />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">关于</h1>
        </div>
      </div>

      <Container className="py-12 space-y-16">
        {/* 个人介绍 */}
        <FadeUp delay={0.05}>
          <div className="card-glass p-6 space-y-4 text-sm leading-relaxed text-secondary">
            <p>
              你好，我是 <span className="text-text font-semibold">Chao</span>，一名 AI 工程师与全栈开发者。
              我热衷于将前沿 AI 技术转化为实际可用的产品，构建那些让生活和工作更高效的工具。
            </p>
            <p>
              我的技术栈覆盖从前端（React / Next.js）到后端（Node.js / PostgreSQL），
              以及 AI 工程（Claude API / LLM / RAG）。相信好的产品需要技术与设计的双重驱动。
            </p>
            <p>
              业余时间我在这里记录思考、分享项目、留存生活。如果你有有趣的想法或合作机会，欢迎联系。
            </p>
          </div>
        </FadeUp>

        {/* 职业经历 */}
        <FadeUp delay={0.1}>
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-muted">Experience</h2>
            <div className="space-y-0">
              {EXPERIENCE.map((e, i) => (
                <div key={i} className="flex gap-6 py-4 border-b border-border/60 last:border-0">
                  <span className="text-xs text-muted whitespace-nowrap pt-0.5 w-24 shrink-0">{e.year}</span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{e.role}</p>
                    <p className="text-xs text-secondary">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* 技能 */}
        <FadeUp delay={0.15}>
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-muted">Skills</h2>
            <div className="space-y-4">
              {SKILLS.map(s => (
                <div key={s.label} className="flex gap-4 items-start">
                  <span className="text-xs text-muted w-16 shrink-0 pt-0.5">{s.label}</span>
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map(t => (
                      <span key={t} className="text-xs bg-white/70 backdrop-blur-sm border border-white/50 rounded-full px-3 py-1 text-secondary hover:border-accent/40 hover:text-accent transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* 联系方式 */}
        <FadeUp delay={0.2}>
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-muted">Contact</h2>
            <div className="flex flex-col gap-3">
              <a href="mailto:2325052506@qq.com"
                className="group/link inline-flex items-center gap-3 text-sm text-secondary hover:text-accent transition-colors w-fit">
                <span className="text-base">✉️</span>
                <span className="relative">
                  2325052506@qq.com
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover/link:w-full transition-all duration-200" />
                </span>
              </a>
              <a href="https://github.com/LiChaoYYDS" target="_blank" rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-3 text-sm text-secondary hover:text-accent transition-colors w-fit">
                <span className="text-base">🐙</span>
                <span className="relative">
                  github.com/LiChaoYYDS
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover/link:w-full transition-all duration-200" />
                </span>
              </a>
            </div>
          </div>
        </FadeUp>
      </Container>
    </PageTransition>
  )
}
