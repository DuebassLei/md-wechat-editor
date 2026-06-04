import type { CardBgPattern, CardThemeId } from './cardThemes/types'
import { getCardTheme } from './cardThemes/registry'

/** 将 hex 色转为带透明度的 rgba，避免 html-to-image 不支持的 color-mix */
export function hexAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  if (h.length !== 6) return hex
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function patternRules(pattern: CardBgPattern, accent: string, line: string): string {
  switch (pattern) {
    case 'dot-grid':
      return `
.card-studio-shell--dot-grid{background-image:radial-gradient(circle,${hexAlpha(accent, 0.22)} 0.8px,transparent 0.8px);background-size:14px 14px;}
`
    case 'notebook-lines':
      return `
.card-studio-shell--notebook-lines{background-image:repeating-linear-gradient(0deg,transparent,transparent 27px,${hexAlpha(line, 0.55)} 27px,${hexAlpha(line, 0.55)} 28px);}
.card-studio-shell--notebook-lines::before{content:"";position:absolute;left:18px;top:0;bottom:0;width:1.5px;background:${hexAlpha('#E8B4B4', 0.55)};pointer-events:none;z-index:0;}
`
    case 'paper-grain':
      return `
.card-studio-shell--paper-grain{background-image:radial-gradient(circle at 20% 30%,${hexAlpha('#000', 0.03)} 0%,transparent 50%),radial-gradient(circle at 80% 70%,${hexAlpha('#000', 0.025)} 0%,transparent 45%),repeating-linear-gradient(45deg,transparent,transparent 2px,${hexAlpha('#000', 0.012)} 2px,${hexAlpha('#000', 0.012)} 3px);}
`
    case 'bloom':
      return `
.card-studio-shell--bloom{background-image:radial-gradient(ellipse 70% 55% at 8% 12%,${hexAlpha(accent, 0.14)} 0%,transparent 55%),radial-gradient(ellipse 60% 50% at 92% 88%,${hexAlpha(accent, 0.1)} 0%,transparent 50%);}
`
    case 'macaron-dots':
      return `
.card-studio-shell--macaron-dots{background-image:radial-gradient(circle at 12% 18%,${hexAlpha(accent, 0.35)} 3px,transparent 3px),radial-gradient(circle at 88% 22%,${hexAlpha('#F5B7B1', 0.4)} 3px,transparent 3px),radial-gradient(circle at 18% 82%,${hexAlpha('#AED6F1', 0.35)} 3px,transparent 3px),radial-gradient(circle at 85% 78%,${hexAlpha('#F9E79F', 0.4)} 3px,transparent 3px);}
`
    case 'tech-grid':
      return `
.card-studio-shell--tech-grid{background-image:linear-gradient(${hexAlpha(accent, 0.08)} 1px,transparent 1px),linear-gradient(90deg,${hexAlpha(accent, 0.08)} 1px,transparent 1px);background-size:20px 20px;}
`
    case 'film-grain':
      return `
.card-studio-shell--film-grain{background-image:radial-gradient(circle at 50% 50%,${hexAlpha('#000', 0.04)} 0%,transparent 70%),repeating-linear-gradient(0deg,transparent,transparent 3px,${hexAlpha('#000', 0.015)} 3px,${hexAlpha('#000', 0.015)} 4px);}
.card-studio-shell--film-grain::after{content:"";position:absolute;inset:0;box-shadow:inset 0 0 40px ${hexAlpha('#000', 0.12)};pointer-events:none;z-index:0;}
`
    case 'color-block':
      return `
.card-studio-shell--color-block::before{content:"";position:absolute;top:0;right:0;width:38%;height:28%;background:${hexAlpha(accent, 0.12)};border-bottom-left-radius:18px;pointer-events:none;z-index:0;}
`
    case 'soft-wash':
      return `
.card-studio-shell--soft-wash{background-image:radial-gradient(ellipse 90% 60% at 100% 0%,${hexAlpha(accent, 0.08)} 0%,transparent 55%),radial-gradient(ellipse 70% 50% at 0% 100%,${hexAlpha(accent, 0.06)} 0%,transparent 50%);}
`
    default:
      return ''
  }
}

export function buildCardPatternStyleBlock(themeId: CardThemeId): string {
  const theme = getCardTheme(themeId)
  const pattern = theme.style.bgPattern ?? 'none'
  if (pattern === 'none') return ''

  const { accent, hr } = theme.tokens
  const base = `
.card-studio-shell{position:relative;overflow:hidden;}
.card-studio-shell > .card-reading,.card-studio-shell > .card-studio-header{position:relative;z-index:1;}
${patternRules(pattern, accent, hr)}
`.trim()

  return `<style>${base}</style>`
}

export function shellPatternClass(themeId: CardThemeId): string {
  const pattern = getCardTheme(themeId).style.bgPattern ?? 'none'
  return pattern !== 'none' ? ` card-studio-shell--${pattern}` : ''
}
