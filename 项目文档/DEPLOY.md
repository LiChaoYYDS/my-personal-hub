# 部署文档

## 方式一：Docker Compose（推荐）

### 1. 服务器准备

```bash
# 安装 Docker 和 Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### 2. 拉取代码

```bash
git clone <your-repo>
cd personal-hub
```

### 3. 配置环境变量

```bash
cp .env.example .env
vim .env
```

必填项：

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
DATABASE_URL=postgresql://postgres:yourpassword@postgres:5432/hub
POSTGRES_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret_min_32_chars_long
DEEPSEEK_API_KEY=sk-...
S3_ENDPOINT=http://minio:9000
S3_BUCKET=uploads
S3_ACCESS_KEY=admin
S3_SECRET_KEY=yourminiopassword
S3_PUBLIC_URL=https://yourdomain.com/storage
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=yourminiopassword
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=yourpassword
```

### 4. 配置 Nginx 证书

```bash
mkdir certs
# 将 SSL 证书放入 certs/ 目录
cp fullchain.pem certs/
cp privkey.pem certs/

# 修改 nginx.conf 中的域名
sed -i 's/yourdomain.com/your-actual-domain.com/g' nginx.conf
```

> 使用 Let's Encrypt 免费证书：
> ```bash
> sudo apt install certbot
> sudo certbot certonly --standalone -d yourdomain.com
> sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem certs/
> sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem certs/
> ```

### 5. 启动服务

```bash
docker compose up -d --build
```

### 6. 初始化数据库

```bash
# 等待 postgres 启动后执行
docker compose exec nextjs npx prisma db push
docker compose exec nextjs npx tsx scripts/create-admin.ts
```

### 7. 配置 MinIO 存储桶

访问 http://yourdomain.com:9001（MinIO 控制台）

1. 用 `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` 登录
2. 创建名为 `uploads` 的 Bucket
3. 将 Bucket 设置为 **Public**（允许匿名读取）

---

## 方式二：Vercel + 外部数据库

适合不想维护服务器的场景。

### 1. 部署到 Vercel

```bash
npm i -g vercel
vercel
```

### 2. 配置环境变量

在 Vercel 控制台 → Settings → Environment Variables 中添加所有 `.env` 变量。

> ⚠️ `S3_ENDPOINT` 改为外部 MinIO 或 Cloudflare R2 地址

### 3. 数据库

推荐使用：
- [Supabase](https://supabase.com)（PostgreSQL，免费套餐）
- [Neon](https://neon.tech)（Serverless PostgreSQL）

```bash
# 连接外部数据库后推送 schema
DATABASE_URL=postgresql://... npx prisma db push
```

### 4. 存储

推荐使用 [Cloudflare R2](https://developers.cloudflare.com/r2/)（兼容 S3 API，免费出口流量）：

```env
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=uploads
S3_ACCESS_KEY=<r2-access-key>
S3_SECRET_KEY=<r2-secret-key>
S3_PUBLIC_URL=https://pub-xxx.r2.dev
```

---

## 更新部署

### Docker Compose 更新

```bash
git pull
docker compose up -d --build nextjs
```

### 数据库迁移（有 schema 变更时）

```bash
docker compose exec nextjs npx prisma migrate deploy
```

---

## 常见问题

**Q: 上传图片提示 403**
- 检查 MinIO Bucket 是否设为 Public
- 检查 `S3_PUBLIC_URL` 是否正确

**Q: AI 聊天无响应**
- 检查 `DEEPSEEK_API_KEY` 是否配置
- 查看日志：`docker compose logs nextjs`

**Q: 管理后台无法登录**
- 确认已执行 `create-admin.ts`
- 检查 `JWT_SECRET` 是否与生成时一致

**Q: 页面样式失效**
- 重启容器清理缓存：`docker compose restart nextjs`

---

## 日志与监控

```bash
# 查看所有服务日志
docker compose logs -f

# 只看 Next.js 日志
docker compose logs -f nextjs

# 查看数据库日志
docker compose logs -f postgres
```
