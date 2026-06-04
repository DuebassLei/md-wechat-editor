import { DEFAULT_XHS_BRAND } from '@/engine/card-export/brands'
import { extractCardMeta } from '@/engine/card-export/extractMeta'
import { sliceContentToDataUrls } from '@/engine/card-export/sliceContent'
import { buildCardStudioCover, canBuildCover } from './buildCover'
import { cardThemeToExportTheme } from './cardThemeStyles'
import { exportCardHtmlToDataUrl } from './exportCardHtml'
import { prepareCardHtml } from './prepareCardHtml'
import { splitByManualBreaks } from './splitPages'
import { getCardTheme } from './cardThemes/registry'
import type { BuildCardPagesOptions, CardPage } from './types'

export async function buildCardPages(opts: BuildCardPagesOptions): Promise<{
  pages: CardPage[]
  hadModules: boolean
  brand: string
}> {
  const {
    markdown,
    themeId,
    aspect,
    singleCardMode,
    includeCover,
    brand: brandIn,
    previewWidth,
  } = opts

  const { meta, contentMd } = extractCardMeta(markdown, DEFAULT_XHS_BRAND)
  const brand = brandIn.trim() || meta.brand || DEFAULT_XHS_BRAND
  const exportBg = getCardTheme(themeId).tokens.exportBg

  const pages: CardPage[] = []
  let globalIndex = 0
  let hadModules = false

  if (includeCover && canBuildCover(meta)) {
    const coverHtml = buildCardStudioCover({ ...meta, brand }, aspect, themeId)
    const coverUrl = await exportCardHtmlToDataUrl(coverHtml, aspect, previewWidth, exportBg)
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

  const segments = splitByManualBreaks(contentMd)
  for (const seg of segments) {
    if (!seg.markdown.trim()) continue
    const prepared = prepareCardHtml(seg.markdown, themeId)
    hadModules = hadModules || prepared.hadModules
    const { dataUrls, overflow } = await sliceContentToDataUrls({
      contentHtml: prepared.html,
      brand,
      aspect,
      previewContentWidth: previewWidth,
      theme: cardThemeToExportTheme(themeId),
      frameId: 'none',
      maxPages: singleCardMode ? 1 : undefined,
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
        overflow: singleCardMode && overflow,
      })
      globalIndex++
    })
  }

  return { pages, hadModules, brand }
}
