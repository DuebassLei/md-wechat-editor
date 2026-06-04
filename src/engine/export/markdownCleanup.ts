/** 剥离 <style> 与内联 style="..." */
export function stripInlineHtmlStyles(markdown: string): string {
  return markdown
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\sstyle="[^"]*"/gi, '')
}

/** <details><summary>标题</summary>正文</details> → **标题** + 正文 */
export function transformDetailsBlocks(markdown: string): string {
  return markdown.replace(
    /<details>\s*<summary>([\s\S]*?)<\/summary>\s*([\s\S]*?)<\/details>/gi,
    (_, summary, content) => `**${summary.trim()}**\n\n${content.trim()}`,
  )
}

/** 围栏代码块无语言标识时补 text */
export function ensureCodeFenceLanguages(markdown: string): string {
  return markdown.replace(/^```(\s*\n)/gm, '```text$1')
}

/** 连续空行 ≥3 压缩为 2 */
export function collapseExtraBlankLines(markdown: string): string {
  return markdown.replace(/\n{3,}/g, '\n\n').trim()
}

/** 统计非 http(s) 图片 */
export function countLocalImages(markdown: string): number {
  const re = /!\[[^\]]*\]\(([^)]+)\)/g
  let count = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(markdown)) !== null) {
    const url = m[1].trim()
    if (!/^https?:\/\//i.test(url)) count++
  }
  return count
}

export function applySharedCleanup(markdown: string): string {
  let out = markdown
  out = stripInlineHtmlStyles(out)
  out = transformDetailsBlocks(out)
  out = ensureCodeFenceLanguages(out)
  out = collapseExtraBlankLines(out)
  return out
}
