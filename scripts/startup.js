/**
 * Startup script for production: run migrations, seed data, then start Next.js
 */
const { execSync } = require('child_process')

console.log('[startup] Running database migrations...')
execSync('npx prisma migrate deploy', { stdio: 'inherit' })

console.log('[startup] Seeding project data from MDX files...')
try {
  execSync('npx tsx scripts/seed-projects.ts', { stdio: 'inherit' })
} catch {
  console.log('[startup] Seed skipped or failed (non-fatal)')
}

console.log('[startup] Starting Next.js...')
require('./server.js')
