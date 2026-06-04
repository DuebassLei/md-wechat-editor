import { zipSync } from 'fflate'

export function dataUrlToBytes(dataUrl: string): Uint8Array {
  const comma = dataUrl.indexOf(',')
  const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function buildZipBlob(files: Record<string, Uint8Array>): Blob {
  const zipped = zipSync(files, { level: 6 })
  return new Blob([zipped], { type: 'application/zip' })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.download = filename
  a.href = url
  a.click()
  URL.revokeObjectURL(url)
}

export function xhsZipArchiveName(date = new Date().toISOString().slice(0, 10)): string {
  return `xhs_${date}.zip`
}

export function wechatTietuZipArchiveName(date = new Date().toISOString().slice(0, 10)): string {
  return `wechat_tietu_${date}.zip`
}
