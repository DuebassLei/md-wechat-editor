/**
 * AI 靛紫主题 · 文末互动 CTA（点赞 / 转发 / 推荐）
 * 参考公众号文末引导样式，默认自动追加在正文末尾。
 */

export interface AiIndigoCtaMeta {
  title: string
  labels: string
  thanks: string
}

export const AI_INDIGO_CTA_DEFAULTS: AiIndigoCtaMeta = {
  // title: '如果这份文档对你有帮助，欢迎点赞、转发、推荐！',
  title: '如果对你有帮助，欢迎点赞、转发、推荐！',
  labels: '点赞 · 转发 · 推荐',
  thanks: 'THANKS FOR READING',
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** 解析 YAML：cta: false 关闭；ctaTitle / ctaLabels / ctaThanks 自定义文案 */
export function resolveAiIndigoCta(meta: Record<string, string>): AiIndigoCtaMeta | null {
  const flag = (meta.cta ?? meta.ctaEnabled ?? 'true').trim()
  if (/^(false|0|no|off)$/i.test(flag)) return null

  return {
    title: meta.ctaTitle || meta.ctaHeading || AI_INDIGO_CTA_DEFAULTS.title,
    labels: meta.ctaLabels || AI_INDIGO_CTA_DEFAULTS.labels,
    thanks: meta.ctaThanks || meta.ctaFooter || AI_INDIGO_CTA_DEFAULTS.thanks,
  }
}

const INDIGO = '#5856e9'
const INDIGO_SOFT = '#4f46e5'

function svgWrap(pathD: string, viewBox = '0 0 24 24'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="28" height="28" fill="${INDIGO}" style="display:block;width:28px;height:28px;" aria-hidden="true"><path d="${pathD}"/></svg>`
}

/** Material-style 实心图标（微信粘贴友好） */
const ICONS = {
  like: svgWrap(
    'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z',
  ),
  share: svgWrap(
    'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z',
  ),
  heart: svgWrap(
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  ),
}

/** 构建文末互动块 HTML（内联样式，适配微信） */
export function buildAiIndigoCtaHtml(cta: AiIndigoCtaMeta = AI_INDIGO_CTA_DEFAULTS): string {
  const iconCell = (svg: string) =>
    `<section style="margin:0;padding:0;text-indent:0;display:flex;align-items:center;justify-content:center;width:36px;height:36px;">${svg}</section>`

  const iconsRow = `<section class="awp-ai-indigo-cta__icons" style="margin:10px 0 8px;padding:0;text-indent:0;display:flex;justify-content:center;align-items:center;gap:18px;">${iconCell(ICONS.like)}${iconCell(ICONS.share)}${iconCell(ICONS.heart)}</section>`

  return `<section class="awp-ai-indigo-cta" style="margin:20px 0 0;padding:16px 12px 14px;background:#f8f9fb;text-align:center;text-indent:0;border-bottom:1px dashed #e2e8f0;" data-tool="mdnice编辑器">
<section class="awp-ai-indigo-cta__title" style="margin:0;padding:0;font-size:15px;font-weight:700;line-height:1.45;color:#1e293b;text-indent:0;"><span>${escapeHtml(cta.title)}</span></section>
${iconsRow}
<section class="awp-ai-indigo-cta__labels" style="margin:0 0 10px;padding:0;font-size:12px;font-weight:600;line-height:1.4;color:${INDIGO_SOFT};text-indent:0;"><span>${escapeHtml(cta.labels)}</span></section>
<section class="awp-ai-indigo-cta__thanks" style="margin:0;padding:0;font-size:10px;font-weight:500;line-height:1.3;color:#cbd5e1;text-indent:0;letter-spacing:0.16em;text-transform:uppercase;"><span>${escapeHtml(cta.thanks)}</span></section>
</section>`
}
