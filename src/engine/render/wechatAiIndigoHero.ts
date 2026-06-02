/**

 * AI 靛紫主题 · 文首块（封面 / 标签行 / 目录卡）

 * 样式参考 https://mp.weixin.qq.com/s/BftXGRmb5XtlLTleTfQNIg

 */



export interface AiIndigoHeroMeta {

  eyebrow?: string

  title: string

  subtitle?: string

}



export interface AiIndigoTocMeta {

  title: string

  prevLabel?: string

  prevUrl?: string

}



export interface AiIndigoArticleMeta {

  body: string

  hero: AiIndigoHeroMeta

  tags: string[]

  toc?: AiIndigoTocMeta

}



const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

const TAGS_LINE_RE = /^【标签】\s*(.+)\s*$/

const TOC_LINE_RE = /^【目录】\s*(.+)\s*$/

const TOC_PREV_LINE_RE = /^【上一篇】\s*(.+?)(?:\s*[|｜]\s*(https?:\S+))?\s*$/



function escapeHtml(text: string): string {

  return text

    .replace(/&/g, '&amp;')

    .replace(/</g, '&lt;')

    .replace(/>/g, '&gt;')

    .replace(/"/g, '&quot;')

}



function parseFrontmatter(block: string): Record<string, string> {

  const out: Record<string, string> = {}

  for (const line of block.split('\n')) {

    const m = line.match(/^([\w-]+):\s*(.+)$/)

    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')

  }

  return out

}



function parseTagList(raw: string): string[] {

  if (!raw?.trim()) return []

  return raw

    .split(/[,，、|·]/)

    .map((s) => s.trim())

    .filter(Boolean)

    .slice(0, 12)

}



function isBlockStart(line: string): boolean {

  const t = line.trim()

  return (

    /^#{1,6}\s/.test(t) ||

    /^[-*+]\s/.test(t) ||

    /^\d+\.\s/.test(t) ||

    /^```/.test(t) ||

    /^>/.test(t) ||

    TAGS_LINE_RE.test(t) ||

    TOC_LINE_RE.test(t) ||

    TOC_PREV_LINE_RE.test(t)

  )

}



function stripLeadingMetaLines(lines: string[], startIndex: number): {

  lines: string[]

  index: number

  tags: string[]

  toc?: AiIndigoTocMeta

} {

  let i = startIndex

  let tags: string[] = []

  let toc: AiIndigoTocMeta | undefined



  while (i < lines.length) {

    const line = lines[i]

    const trimmed = line.trim()

    if (trimmed === '') {

      i++

      continue

    }



    const tagsMatch = trimmed.match(TAGS_LINE_RE)

    if (tagsMatch) {

      tags = parseTagList(tagsMatch[1])

      i++

      continue

    }



    const tocMatch = trimmed.match(TOC_LINE_RE)

    if (tocMatch) {

      toc = { title: tocMatch[1].trim() }

      i++

      const prevMatch = lines[i]?.trim().match(TOC_PREV_LINE_RE)

      if (prevMatch) {

        toc.prevLabel = prevMatch[1].trim()

        toc.prevUrl = prevMatch[2]?.trim()

        i++

      }

      continue

    }



    const prevOnly = trimmed.match(TOC_PREV_LINE_RE)

    if (prevOnly && toc) {

      toc.prevLabel = prevOnly[1].trim()

      toc.prevUrl = prevOnly[2]?.trim()

      i++

      continue

    }



    break

  }



  return { lines, index: i, tags, toc }

}



/**

 * 从 Markdown 提取 AI 靛紫文首块元数据，并移除正文中重复的标题/导语/标签/目录行。

 *

 * YAML：heroTag、heroTitle、heroSubtitle、heroTags/tags/keywords、

 *       tocTitle、tocPrev、tocPrevUrl

 */

export function extractAiIndigoArticleFromMarkdown(markdown: string): AiIndigoArticleMeta {

  let rest = markdown.trimStart()

  let eyebrow = ''

  let title = ''

  let subtitle = ''

  let tags: string[] = []

  let toc: AiIndigoTocMeta | undefined



  const fmMatch = rest.match(FRONTMATTER_RE)

  if (fmMatch) {

    const meta = parseFrontmatter(fmMatch[1])

    eyebrow = meta.heroTag || meta.tag || ''

    title = meta.heroTitle || meta.title || ''

    subtitle = meta.heroSubtitle || meta.subtitle || ''

    tags = parseTagList(meta.heroTags || meta.tags || meta.keywords || '')

    const tocTitle = meta.tocTitle || meta.toc || ''

    if (tocTitle) {

      toc = {

        title: tocTitle,

        prevLabel: meta.tocPrev || meta.tocPrevLabel || meta.prevTitle || undefined,

        prevUrl: meta.tocPrevUrl || meta.tocLink || meta.prevUrl || undefined,

      }

    }

    rest = rest.slice(fmMatch[0].length).trimStart()

  }



  const lines = rest.split('\n')

  let i = 0



  if (!title) {

    const h1 = lines[i]?.match(/^#\s+(.+?)\s*$/)

    if (h1) {

      title = h1[1].trim()

      i++

      while (i < lines.length && lines[i].trim() === '') i++

    }

  } else {

    const h1 = lines[i]?.match(/^#\s+(.+?)\s*$/)

    if (h1 && h1[1].trim() === title.trim()) {

      i++

      while (i < lines.length && lines[i].trim() === '') i++

    }

  }



  if (!subtitle) {

    const paraLines: string[] = []

    while (i < lines.length) {

      const line = lines[i]

      if (isBlockStart(line)) break

      if (line.trim() === '') {

        if (paraLines.length) break

        i++

        continue

      }

      paraLines.push(line)

      i++

    }

    if (paraLines.length) {

      subtitle = paraLines

        .join(' ')

        .replace(/\s+/g, ' ')

        .trim()

        .slice(0, 160)

    }

  }



  const metaStrip = stripLeadingMetaLines(lines, i)

  i = metaStrip.index

  if (!tags.length) tags = metaStrip.tags

  if (!toc && metaStrip.toc) toc = metaStrip.toc



  const body = lines.slice(i).join('\n').trimStart()



  return {

    body,

    hero: {

      eyebrow: eyebrow || undefined,

      title: title || '未命名文章',

      subtitle: subtitle || undefined,

    },

    tags,

    toc,

  }

}



/** @deprecated 使用 extractAiIndigoArticleFromMarkdown */

export function extractAiIndigoHeroFromMarkdown(markdown: string): {

  body: string

  hero: AiIndigoHeroMeta

} {

  const { body, hero } = extractAiIndigoArticleFromMarkdown(markdown)

  return { body, hero }

}



/** 构建文首渐变封面 HTML（内联样式，适配微信粘贴） */

export function buildAiIndigoHeroHtml(hero: AiIndigoHeroMeta): string {

  const eyebrowHtml = hero.eyebrow

    ? `<section style="margin:0 0 16px;padding:0;text-indent:0;"><span style="display:inline-block;padding:4px 14px;border-radius:20px;background:rgba(255,255,255,0.2);font-size:12px;letter-spacing:2px;color:#fff;">${escapeHtml(hero.eyebrow)}</span></section>`

    : ''



  const subtitleHtml = hero.subtitle

    ? `<section style="margin:0;padding:0;font-size:0.85em;opacity:0.85;color:#fff;text-indent:0;max-width:480px;margin-left:auto;margin-right:auto;line-height:1.6;"><span>${escapeHtml(hero.subtitle)}</span></section>`

    : ''



  return `<section class="awp-ai-indigo-hero" style="margin:0;padding:48px 24px 36px;background:linear-gradient(165deg,rgb(55,48,163) 0%,rgb(88,86,233) 40%,rgb(129,140,248) 100%);text-align:center;color:#fff;text-indent:0;" data-tool="mdnice编辑器">${eyebrowHtml}<section style="margin:0 0 16px;padding:0;font-size:1.4em;font-weight:700;line-height:1.5;color:#fff;text-indent:0;"><span>${escapeHtml(hero.title)}</span></section>${subtitleHtml}</section>`

}



/** 关键词标签行（浅紫胶囊 + 深色底条） */

export function buildAiIndigoTagsHtml(tags: string[]): string {

  if (!tags.length) return ''



  const pills = tags

    .map(

      (tag) =>

        `<span class="awp-ai-indigo-tag" style="display:inline-block;margin:0;padding:6px 14px;border-radius:999px;background:#eef2ff;color:#4f46e5;font-size:12px;font-weight:600;line-height:1.4;text-indent:0;">${escapeHtml(tag)}</span>`,

    )

    .join('')



  return `<section class="awp-ai-indigo-tags" style="margin:0;padding:16px 12px 12px;background:#111827;text-align:center;text-indent:0;" data-tool="mdnice编辑器"><section class="awp-ai-indigo-tags__row" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:0;padding:0;text-indent:0;">${pills}</section></section>`

}



/** 目录 / 上一篇导航卡 */

export function buildAiIndigoTocHtml(toc: AiIndigoTocMeta): string {

  const titleRow = `<section class="awp-ai-indigo-toc__head" style="margin:0 0 12px;padding:0;font-size:13px;color:#9ca3af;text-indent:0;display:flex;justify-content:space-between;align-items:center;line-height:1.5;"><span>${escapeHtml(toc.title)}</span><span style="opacity:0.75;font-size:14px;" aria-hidden="true">☰</span></section>`



  let prevRow = ''

  if (toc.prevLabel) {

    const label = `‹ 上一篇 · ${toc.prevLabel}`

    prevRow = toc.prevUrl

      ? `<section style="margin:0;padding:0;font-size:13px;line-height:1.65;text-indent:0;"><a class="awp-ai-indigo-toc__link" href="${escapeHtml(toc.prevUrl)}" style="color:#c7d2fe;text-decoration:none;font-weight:500;border-bottom:none;">${escapeHtml(label)}</a></section>`

      : `<section class="awp-ai-indigo-toc__prev" style="margin:0;padding:0;font-size:13px;line-height:1.65;color:#d1d5db;text-indent:0;"><span>${escapeHtml(label)}</span></section>`

  }



  return `<section class="awp-ai-indigo-toc" style="margin:0;padding:0 12px 20px;text-indent:0;" data-tool="mdnice编辑器"><section class="awp-ai-indigo-toc__card" style="margin:0;padding:16px 18px;border-radius:12px;background:#1f2937;color:#e5e7eb;text-indent:0;">${titleRow}${prevRow}</section></section>`

}



/** 文首块：封面 + 标签 + 目录卡 */

export function buildAiIndigoPreambleHtml(

  hero: AiIndigoHeroMeta,

  tags: string[] = [],

  toc?: AiIndigoTocMeta,

): string {

  const parts = [buildAiIndigoHeroHtml(hero)]

  const tagsHtml = buildAiIndigoTagsHtml(tags)

  if (tagsHtml) parts.push(tagsHtml)

  if (toc?.title) parts.push(buildAiIndigoTocHtml(toc))

  return parts.join('')

}


