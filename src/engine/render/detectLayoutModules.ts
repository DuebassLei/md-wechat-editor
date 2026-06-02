/** 检测 Markdown 是否含 ::: 排版模块语法 */
const LAYOUT_MODULE_PATTERNS = [
  /^:::\s*[\w-]+/m,
  /^>\s*\[(?:TIP|NOTE|WARNING|CAUTION|IMPORTANT)\]/m,
]

export function markdownUsesLayoutModules(markdown: string): boolean {
  if (!markdown?.trim()) return false
  return LAYOUT_MODULE_PATTERNS.some((re) => re.test(markdown))
}
