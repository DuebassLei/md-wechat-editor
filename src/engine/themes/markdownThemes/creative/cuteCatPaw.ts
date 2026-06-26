import { CUTE_WATERMARKS, cuteBaseCss, cuteHeadingCss } from './cuteDecor'

/** 猫爪日常 — 暖杏 + 爪印角标 */
export default cuteBaseCss({
  bg: '#FFFBF7',
  text: '#5A4F48',
  accent: '#E8987A',
  accent2: '#F5C4A8',
  quoteBg: '#FFF3EC',
  headingCss: cuteHeadingCss({
    h1Bg: '#FFEDE4',
    h1Color: '#C4704E',
    h1Watermark: CUTE_WATERMARKS.paw,
    h1PrefixEmoji: '🐾',
    h1SuffixEmoji: '💕',
    h2PrefixEmoji: '🐱',
    h2SuffixEmoji: '♡',
  }),
})
