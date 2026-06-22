import { DEFAULT_XHS_BRAND } from '@/engine/card-export/brands'
import { extractCardMeta } from '@/engine/card-export/extractMeta'
import { sliceContentToDataUrls } from '@/engine/card-export/sliceContent'
import { buildCardStudioCover, canBuildCover } from './buildCover'
import { cardThemeToExportTheme } from './cardThemeStyles'
import type { CardSplitMode } from './constants'
import { exportCardHtmlToDataUrl } from './exportCardHtml'
import { prepareCardHtml } from './prepareCardHtml'
import { splitByManualBreaks } from './splitPages'
import { getCardTheme } from './cardThemes/registry'
import type { BuildCardPagesOptions, CardPage, CardSegment } from './types'

function resolveSegments(contentMd: string, splitMode: CardSplitMode): CardSegment[] {
  if (splitMode === 'hrSplit') return splitByManualBreaks(contentMd)
  const trimmed = contentMd.trim()
  if (!trimmed) return [{ index: 0, markdown: '' }]
  return [{ index: 0, markdown: contentMd }]
}

export async function buildCardPages(opts: BuildCardPagesOptions): Promise<{
  pages: CardPage[]
  hadModules: boolean
  brand: string
}> {
  const {
    markdown,
    themeId,
    aspect,
    splitMode,
    includeCover,
    brand: brandIn,
    previewWidth,
    showPageNumbers = true,
    showBrand = true,
    overflowHidden = false,
    richContent = false,
    purpose = 'preview',
  } = opts

  const { meta, contentMd } = extractCardMeta(markdown, DEFAULT_XHS_BRAND)
  const resolvedBrand = brandIn.trim() || meta.brand || DEFAULT_XHS_BRAND
  const footerBrand = showBrand ? resolvedBrand : ''
  const exportBg = getCardTheme(themeId).tokens.exportBg

  const pages: CardPage[] = []
  let globalIndex = 0
  let hadModules = false

  if (includeCover && canBuildCover(meta)) {
    const coverHtml = buildCardStudioCover(
      { ...meta, brand: resolvedBrand },
      aspect,
      themeId,
      { showBrand },
    )
    const coverUrl = await exportCardHtmlToDataUrl(coverHtml, aspect, previewWidth, exportBg, purpose)
    pages.push({
      id: 'cover',
      kind: 'cover',
      label: '封面首图',
      segmentIndex: -1,
      pageIndex: 0,
      totalInSegment: 1,
      globalIndex,
      html: coverHtml,
      dataUrl: coverUrl,
    })
    globalIndex++
  }

  const segments = resolveSegments(contentMd, splitMode)
  const maxPages = splitMode === 'noSplit' ? 1 : undefined

  for (const seg of segments) {
    if (!seg.markdown.trim()) continue
    const needsRich = richContent || /style=\{\{/.test(seg.markdown)
    const prepared = prepareCardHtml(seg.markdown, themeId, { richContent: needsRich })
    hadModules = hadModules || prepared.hadModules
    const { dataUrls, overflow } = await sliceContentToDataUrls({
      contentHtml: prepared.html,
      brand: footerBrand,
      aspect,
      previewContentWidth: previewWidth,
      theme: cardThemeToExportTheme(themeId),
      frameId: 'none',
      maxPages,
      showBrand,
      showPageNumbers,
      overflowHidden,
      purpose,
    })
    const totalInSegment = dataUrls.length
    dataUrls.forEach((dataUrl, pageIndex) => {
      pages.push({
        id: `s${seg.index}-p${pageIndex}`,
        kind: 'content',
        label: `内容 ${globalIndex + 1}`,
        segmentIndex: seg.index,
        pageIndex,
        totalInSegment,
        globalIndex,
        html: prepared.html,
        dataUrl,
        overflow: splitMode === 'noSplit' && overflow && !overflowHidden,
      })
      globalIndex++
    })
  }

  return { pages, hadModules, brand: resolvedBrand }
}
