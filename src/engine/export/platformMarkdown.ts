import { normalizeMarkdownContent } from '@/utils/normalizeMarkdownContent'
import { splitFrontmatterToGfm } from './frontmatterToGfm'
import { degradeModulesToGfm } from './moduleToGfm/degrade'
import { countLocalImages } from './markdownCleanup'
import { adaptForJuejin } from './adapters/juejin'
import { adaptForCsdn } from './adapters/csdn'
import type { ConversionEntry, PlatformExportResult, PlatformTarget } from './types'

function buildWarnings(
  entries: ConversionEntry[],
  localImages: number,
  extra: string[],
  platform: PlatformTarget,
): string[] {
  const warnings: string[] = [...extra]
  const ctaCount = entries.filter((e) => e.moduleId === 'cta').length
  if (ctaCount) warnings.push('cta 按钮样式将丢失，已转为粗体文字')
  if (localImages) warnings.push(`${localImages} 张图片非 http(s) URL，需替换为在线地址`)
  if (platform === 'csdn') {
    warnings.push('CSDN 会自动转存外链图片，失败需手动上传')
  }
  return warnings
}

export function buildPlatformMarkdown(
  markdown: string,
  platform: PlatformTarget,
): PlatformExportResult {
  const normalized = normalizeMarkdownContent(markdown)
  const { preamble, body } = splitFrontmatterToGfm(normalized)
  const { markdown: degraded, entries } = degradeModulesToGfm(body)
  const merged = [preamble, degraded].filter(Boolean).join('\n\n')

  let resultMd: string
  let extraWarnings: string[] = []

  if (platform === 'juejin') {
    resultMd = adaptForJuejin(merged)
  } else {
    const csdn = adaptForCsdn(merged)
    resultMd = csdn.markdown
    extraWarnings = csdn.warnings
  }

  const localImageCount = countLocalImages(resultMd)
  return {
    markdown: resultMd,
    report: {
      entries,
      warnings: buildWarnings(entries, localImageCount, extraWarnings, platform),
      localImageCount,
    },
  }
}
