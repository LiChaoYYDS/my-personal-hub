// 测试上传 API
import fs from 'fs'
import path from 'path'

async function test() {
  // 创建一个小测试图片（1x1 像素 PNG）
  const pngBytes = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  )

  const formData = new FormData()
  const blob = new Blob([pngBytes], { type: 'image/png' })
  formData.append('file', blob, 'test.png')

  console.log('Testing upload API...')
  const res = await fetch('http://localhost:3000/api/uploads', {
    method: 'POST',
    body: formData,
  })

  console.log('Status:', res.status, res.statusText)
  const text = await res.text()
  console.log('Response body:', text.slice(0, 500))
}

test().catch(console.error)
