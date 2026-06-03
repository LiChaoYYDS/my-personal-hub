# 个人空间 · Personal Hub

一个基于 Next.js 14 的全功能个人网站，集博客、项目展示、生活记录、AI 助手于一体。

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | TailwindCSS + CSS Variables |
| 动画 | Framer Motion |
| 内容 | MDX (博客/项目) |
| 数据库 | PostgreSQL + Prisma |
| 存储 | MinIO / Cloudflare R2 / AWS S3 |
| AI | DeepSeek V3 / Anthropic Claude |
| 部署 | Docker + Nginx |

---

## 项目结构

```
personal-hub/
├── src/
│   ├── app/
│   │   ├── (site)/          # 公开页面
│   │   │   ├── page.tsx         # 首页（Banner + 文章卡片 + 侧边栏）
│   │   │   ├── blog/            # 博客归档 & 详情
│   │   │   ├── projects/        # 项目展示
│   │   │   ├── life/            # 生活记录（朋友圈风格）
│   │   │   ├── about/           # 关于页面
│   │   │   └── search/          # AI 智能搜索
│   │   ├── admin/           # 后台管理（需登录）
│   │   │   ├── dashboard/       # 仪表盘
│   │   │   ├── blog/            # 博客管理
│   │   │   ├── projects/        # 项目管理
│   │   │   └── life/            # 生活记录管理
│   │   └── api/             # API 路由
│   │       ├── ai/              # AI 聊天 / 搜索 / 生成
│   │       ├── blog/            # 博客 CRUD
│   │       ├── projects/        # 项目 CRUD
│   │       ├── life/            # 生活记录 CRUD
│   │       ├── uploads/         # 文件上传
│   │       └── auth/            # 登录 / 登出
│   ├── components/
│   │   ├── layout/          # Header / Footer / Sidebar / Container
│   │   └── ui/              # motion / ReadingProgress / ThemeToggle
│   ├── features/
│   │   ├── home/            # HomeBanner / HomePosts / HomeProjects
│   │   ├── blog/            # BlogList / ArchiveTimeline / TableOfContents
│   │   ├── project/         # ProjectCards / ProjectForm
│   │   ├── life/            # LifeFeed / LifeTimeline
│   │   └── ai/              # ChatWidget
│   ├── lib/
│   │   ├── mdx.ts           # MDX 文件读取 / 解析
│   │   ├── prisma.ts        # Prisma 客户端
│   │   ├── storage.ts       # S3 文件存储
│   │   ├── auth.ts          # JWT 认证
│   │   └── rateLimit.ts     # 接口限速
│   ├── content/
│   │   ├── posts/           # 博客 MDX 文件
│   │   └── projects/        # 项目 MDX 文件
│   └── styles/
│       ├── globals.css      # 全局样式
│       └── tokens.css       # CSS 变量（颜色/圆角/阴影）
├── prisma/schema.prisma     # 数据库模型
├── docker-compose.yml       # Docker 服务编排
├── nginx.conf               # Nginx 反向代理配置
└── .env.example             # 环境变量示例
```

---

## 功能模块

### 博客系统
- MDX 文件驱动，支持代码高亮、自定义组件
- 归档页：时间线布局，按年分组
- 详情页：全宽 Banner + 正文 + 目录 + 侧边栏
- 阅读时长自动计算

### 项目展示
- MDX 文件 + Prisma 双模式
- 支持按分组展示、技术栈标签、GitHub/Demo 链接
- 后台支持附件上传（图片/PDF/ZIP）

### 生活记录
- 朋友圈风格卡片流，支持图片网格（智能布局）
- 图片 Lightbox 全屏查看
- 右侧时间线联动，点击平滑滚动

### AI 功能
- 右下角悬浮聊天窗（DeepSeek V3，流式输出）
- AI 智能搜索：自然语言理解，推荐相关文章

### 后台管理
- JWT 认证，Cookie 存储
- 博客/项目/生活记录的 CRUD
- 图片上传至 S3 兼容存储

---

## 本地开发

### 前置要求
- Node.js 18+
- PostgreSQL 14+（或 Docker）
- MinIO 或 S3 兼容存储（文件上传可选）

### 快速启动

```bash
# 1. 克隆项目
git clone <your-repo>
cd personal-hub

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，填写数据库连接、JWT 密钥等

# 4. 初始化数据库
npm run db:push

# 5. 创建管理员账号
npx tsx scripts/create-admin.ts

# 6. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 数据库命令

```bash
npm run db:push       # 推送 schema 到数据库（开发环境）
npm run db:migrate    # 创建迁移（生产环境）
npm run db:studio     # 打开 Prisma Studio 可视化管理
```

---

## 内容管理

### 新增博客文章

在 `src/content/posts/` 创建 `.mdx` 文件：

```mdx
---
title: "文章标题"
date: "2026-06-01"
tags: ["Next.js", "AI"]
category: "技术"
summary: "一句话摘要"
published: true
cover: "https://example.com/cover.jpg"  # 可选
---

## 正文内容

...
```

### 新增项目

在 `src/content/projects/` 创建 `.mdx` 文件：

```mdx
---
title: "项目名称"
description: "一句话描述"
tech: ["Next.js", "TypeScript"]
github: "https://github.com/..."
demo: "https://example.com"
group: "Web 应用"
year: 2026
published: true
---

## 项目详情

...
```

---

## 主题定制

颜色变量在 `src/styles/tokens.css`：

```css
:root {
  --color-accent: #3b82f6;   /* 主题色 */
  --color-bg: #ffffff;        /* 背景色 */
  /* ... */
}
```

---

## 环境变量说明

| 变量 | 说明 | 必填 |
|------|------|------|
| `DATABASE_URL` | PostgreSQL 连接字符串 | ✅ |
| `JWT_SECRET` | JWT 签名密钥（32位以上） | ✅ |
| `DEEPSEEK_API_KEY` | DeepSeek API Key | AI功能 |
| `ANTHROPIC_API_KEY` | Claude API Key（搜索用） | 搜索功能 |
| `S3_ENDPOINT` | S3 存储端点 | 文件上传 |
| `S3_BUCKET` | 存储桶名称 | 文件上传 |
| `S3_ACCESS_KEY` | 存储访问密钥 | 文件上传 |
| `S3_SECRET_KEY` | 存储私钥 | 文件上传 |
| `S3_PUBLIC_URL` | 文件公开访问地址 | 文件上传 |
| `NEXT_PUBLIC_SITE_URL` | 网站 URL（SEO用） | 推荐 |
| `ADMIN_EMAIL` | 初始管理员邮箱 | 初始化 |
| `ADMIN_PASSWORD` | 初始管理员密码 | 初始化 |
