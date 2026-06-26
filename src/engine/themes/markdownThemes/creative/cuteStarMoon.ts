import { CUTE_WATERMARKS, cuteBaseCss, cuteHeadingCss } from './cuteDecor'

/** 星月童话 — 薰衣草 + 星月角标 */
export default cuteBaseCss({
  bg: '#FAFAFF',
  text: '#4A4A68',
  accent: '#8B7FD8',
  accent2: '#B8AEF0',
  quoteBg: '#F0EEFF',
  headingCss: cuteHeadingCss({
    h1Bg: '#EEECFF',
    h1Color: '#5E52A8',
    h1Watermark: CUTE_WATERMARKS.star,
    h1PrefixEmoji: '⭐',
    h1SuffixEmoji: '🌙',
    h2PrefixEmoji: '✦',
    h2SuffixEmoji: '💫',
  }),
})
