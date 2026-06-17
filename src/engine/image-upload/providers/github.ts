import type { UploadImageResult } from '../../image-pipeline/types'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const base64 = dataUrl.split(',')[1]
      if (!base64) reject(new Error('文件格式不支持'))
      else resolve(base64)
    }
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsDataURL(file)
  })
}

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.')
  return idx > 0 ? filename.substring(idx) : '.jpg'
}

function generatePath(filename: string): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const ts = Date.now()
  return `mdwe-images/${year}/${month}/${day}/${ts}${getExtension(filename)}`
}

export async function uploadToGithub(
  file: File,
  config: { repo: string; token: string; branch: string },
): Promise<UploadImageResult> {
  const repo = config.repo?.trim()
  const token = config.token?.trim()
  if (!repo || !token) throw new Error('请先在设置中配置 GitHub 仓库与 Token')

  const [owner, name] = repo.split('/')
  if (!owner || !name) throw new Error('仓库格式错误，应为 用户名/仓库名')

  const path = generatePath(file.name)
  const content = await fileToBase64(file)
  const branch = config.branch?.trim() || 'main'
  const apiUrl = `https://api.github.com/repos/${owner}/${name}/contents/${path}`

  const res = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Upload via md-wechat-editor',
      content,
      branch,
    }),
  })

  if (!res.ok) {
    if (res.status === 401) throw new Error('GitHub Token 无效或无权限')
    if (res.status === 404) throw new Error('GitHub 仓库不存在')
    throw new Error(`GitHub 上传失败：HTTP ${res.status}`)
  }

  const url = `https://cdn.jsdelivr.net/gh/${owner}/${name}@${branch}/${path}`
  return { url, name: file.name }
}
