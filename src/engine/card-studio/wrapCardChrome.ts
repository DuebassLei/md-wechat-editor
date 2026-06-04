import { shellPatternClass } from './cardThemePatterns'
import { getCardTheme } from './cardThemes/registry'
import type { CardHeaderDecor, CardThemeId } from './cardThemes/types'

export const CARD_HEADER_HEIGHT = 12

function headerClass(decor: CardHeaderDecor): string {
  if (decor === 'none') return 'card-studio-header card-studio-header--none'
  return `card-studio-header card-studio-header--${decor}`
}

/** 为正文 HTML 套上 MD2Card 式顶栏装饰壳 */
export function wrapWithCardChrome(innerHtml: string, themeId: CardThemeId): string {
  const trimmed = innerHtml.trim()
  if (!trimmed) return trimmed

  const theme = getCardTheme(themeId)
  const decor = theme.style.headerDecor ?? 'accent-strip'
  const shellClass = `card-studio-shell${shellPatternClass(themeId)}`
  if (decor === 'none') {
    return `<div class="${shellClass}"><div class="card-reading">${trimmed}</div></div>`
  }
  return (
    `<div class="${shellClass}">` +
    `<div class="${headerClass(decor)}" aria-hidden="true"></div>` +
    `<div class="card-reading">${trimmed}</div>` +
    `</div>`
  )
}
