# 项目知识库

## 架构概览

```
用户请求
  └─ Nginx (反向代理 / SSL)
       └─ Next.js 14 App Router
            ├─ Server Components (RSC) — 数据获取、MDX 渲染
            ├─ Client Components     — 交互、动画、状态
            └─ API Routes            — REST 接口
                  ├─ PostgreSQL (Prisma) — 动态数据
                  ├─ S3/MinIO           — 文件存储
                  └─ DeepSeek / Claude  — AI 能力
```

---

## 关键设计决策

### 1. 内容存储双轨制
- **博客 / 项目**：MDX 文件 → Git 管理，SEO 友好，无需数据库
- **生活记录 / 上传文件**：PostgreSQL → 支持动态增删改
- **原因**：博客内容需要版本控制和离线编辑；动态内容需要实时更新

### 2. Server Component 优先
- 数据获取（`getAllPosts`、`getPostBySlug`）在服务端完成，不暴露给浏览器
- 只有需要交互的组件（搜索、聊天、时间线滚动）标注 `'use client'`
- **注意**：`async` Server Component 不能被 `'use client'` 的 `PageTransition` 包裹

### 3. CSS 变量主题系统
所有颜色通过 CSS 变量定义，Tailwind 通过 `var()` 引用：
```css
/* tokens.css */
--color-accent: #3b82f6;

/* tailwind.config.ts */
accent: 'var(--color-accent)'
```
切换暗色只需 `<html>` 加 `class="dark"` 即可全局生效。

### 4. 流式 AI 响应
聊天接口使用 SSE（Server-Sent Events）格式流式输出：
```
data: {"text":"你"}
data: {"text":"好"}
data: [DONE]
```
客户端逐字追加到消息末尾，实现打字机效果。

---

## 数据模型

### LifeRecord（生活记录）
```prisma
model LifeRecord {
  id        String   @id @default(cuid())
  content   String           // 正文
  images    String[]         // 图片 URL 数组
  location  String?          // 地点
  mood      String?          // 心情 emoji
  createdAt DateTime @default(now())
}
```

### Upload（文件上传记录）
```prisma
model Upload {
  id        String   @id @default(cuid())
  key       String   @unique  // S3 对象 Key
  url       String            // 公开访问 URL
  size      Int               // 字节数
  mimeType  String
  createdAt DateTime @default(now())
}
```

---

## 组件地图

### 布局组件 (`src/components/layout/`)
| 组件 | 职责 |
|------|------|
| `Header` | 顶部导航，首页透明浮层，其他页面白色固定 |
| `Footer` | 底部版权，始终贴底（`flex min-h-screen flex-col` + `flex-1` main） |
| `Sidebar` | 右侧通用侧边栏：头像卡、公告、最新文章 |
| `Container` | `max-w-3xl` 内容容器（旧页面用，新页面用 `max-w-6xl` 直接写） |

### 页面布局模式（新风格）
所有页面遵循统一结构：
```tsx
<>
  {/* Banner: h-52 背景图 + 遮罩 + 居中白字 */}
  <div className="relative w-full h-52 overflow-hidden">...</div>

  {/* 两栏: max-w-6xl, 左侧 flex-1, 右侧 w-72 sticky */}
  <div className="mx-auto max-w-6xl px-6 py-6 flex gap-6 items-start">
    <main className="flex-1 min-w-0">...</main>
    <Sidebar />  {/* 或页面专属侧边栏 */}
  </div>
</>
```

### 功能组件
| 组件 | 位置 | 说明 |
|------|------|------|
| `LifeFeed` | features/life | 朋友圈卡片流，支持 `onRecordsLoad` 回调 |
| `LifeTimeline` | features/life | 右侧联动时间线，`scrollTo` 用 rAF 缓动 |
| `ArchiveTimeline` | features/blog | 博客归档时间线，按年分组 |
| `HomeBanner` | features/home | 首页全宽 Banner + 打字机 |
| `ChatWidget` | features/ai | 右下角悬浮 AI 聊天，DeepSeek 流式 |
| `ReadingProgress` | components/ui | 顶部阅读进度条，`fixed top-0 z-[60]` |

---

## API 接口速查

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/life?page=1` | 获取生活记录（分页 20条） | 无 |
| POST | `/api/life` | 创建生活记录 | 无* |
| PUT | `/api/life/[id]` | 更新生活记录 | 无* |
| DELETE | `/api/life/[id]` | 删除生活记录 | 无* |
| GET | `/api/blog` | 获取博客列表 | 无 |
| POST | `/api/blog` | 创建博客（写 MDX 文件） | 需要 |
| POST | `/api/uploads` | 上传文件（multipart/form-data） | 无* |
| POST | `/api/ai/chat` | AI 聊天（SSE 流式） | 无 |
| POST | `/api/ai/search` | AI 语义搜索 | 无 |
| POST | `/api/auth/login` | 管理员登录 | 无 |
| POST | `/api/auth/logout` | 登出 | 无 |

> \* 接口有 IP 频率限制（rateLimit）

---

## 常见开发任务

### 修改主题色
编辑 `src/styles/tokens.css`：
```css
--color-accent: #3b82f6;       /* 蓝色 → 改为你想要的颜色 */
--color-accent-hover: #2563eb; /* hover 深一点 */
```

### 添加导航项
编辑 `src/components/layout/Header.tsx` 的 `nav` 数组：
```tsx
const nav = [
  { label: '新页面', href: '/new', icon: '⭐' },
  // ...
]
```

### 新增页面（带 Banner 风格）
1. 在 `src/app/(site)/` 下创建 `页面名/page.tsx`
2. 套用标准两栏模板（Banner + flex gap-6）
3. 右侧可选 `<Sidebar />` 或自定义侧边栏

### 修改 AI 模型
编辑 `src/app/api/ai/chat/route.ts`：
```tsx
model: 'deepseek-chat',  // DeepSeek V3
// model: 'deepseek-reasoner',  // DeepSeek R1（推理型）
```

### 修改侧边栏内容
编辑 `src/components/layout/Sidebar.tsx`（统计数字、公告文字等硬编码在此）。

---

## 注意事项 / 已知陷阱

1. **Server Component + framer-motion**：博客详情页是 `async` Server Component，不能被 `PageTransition`（客户端组件）包裹，改用 `<>` Fragment。

2. **文件编码**：在 Windows 上用 PowerShell 写文件时必须指定 UTF-8，否则中文会变成乱码（GBK）。
   ```powershell
   [System.IO.File]::WriteAllText('path', $content, [System.Text.Encoding]::UTF8)
   ```

3. **`.next` 缓存**：修改 `next.config.mjs` 后必须重启 dev server；出现 vendor-chunks 报错先清理 `.next` 目录。

4. **`life/page.tsx` 必须是 Client Component**：因为需要 `useState` 传递 records 给 `LifeTimeline`，所以加了 `'use client'`，不能 `export const metadata`。

5. **图片域名白名单**：新增远程图片来源需在 `next.config.mjs` 的 `remotePatterns` 中添加，否则 `next/image` 报错。

6. **DeepSeek API 兼容 OpenAI SDK**：使用 `openai` 包，设置 `baseURL: 'https://api.deepseek.com'` 即可，无需单独 SDK。
