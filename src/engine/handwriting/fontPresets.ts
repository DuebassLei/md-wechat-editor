export type FontId =
  | 'lxgw-wenkai'
  | 'lxgw-wenkai-lite'
  | 'lxgw-zhenkai'
  | 'lxgw-neo'
  | 'lxgw-fangsong'
  | 'lxgw-marker'
  | 'ma-shan-zheng'
  | 'long-cang'
  | 'zhi-mang-xing'
  | 'liu-jian-mao-cao'
  | 'zcool-kuaile'
  | 'yuji-boku'
  | 'yuji-mai'

export interface FontPreset {
  id: FontId
  name: string
  fontFamily: string
  cssClass: string
  fontSize: number
}

export const FONT_PRESETS: FontPreset[] = [
  {
    id: 'lxgw-wenkai',
    name: '霞鹜文楷',
    fontFamily: '"LXGW WenKai", "KaiTi", "STKaiti", serif',
    cssClass: 'hw-font-lxgw-wenkai',
    fontSize: 22,
  },
  {
    id: 'lxgw-wenkai-lite',
    name: '文楷 Lite',
    fontFamily: '"LXGW WenKai Lite", "LXGW WenKai", "KaiTi", serif',
    cssClass: 'hw-font-lxgw-wenkai-lite',
    fontSize: 22,
  },
  {
    id: 'lxgw-zhenkai',
    name: '霞鹜臻楷',
    fontFamily: '"LXGW ZhenKai", "LXGW WenKai", "KaiTi", serif',
    cssClass: 'hw-font-lxgw-zhenkai',
    fontSize: 22,
  },
  {
    id: 'lxgw-neo',
    name: '霞鹜 Neo',
    fontFamily: '"LXGW Neo XiHei", "LXGW WenKai", "KaiTi", serif',
    cssClass: 'hw-font-lxgw-neo',
    fontSize: 22,
  },
  {
    id: 'lxgw-fangsong',
    name: '霞鹜仿宋',
    fontFamily: '"LXGW FangSong", "FangSong", "STFangsong", serif',
    cssClass: 'hw-font-lxgw-fangsong',
    fontSize: 21,
  },
  {
    id: 'lxgw-marker',
    name: '霞鹜马克笔',
    fontFamily: '"LXGW Marker Gothic", "LXGW WenKai", "KaiTi", sans-serif',
    cssClass: 'hw-font-lxgw-marker',
    fontSize: 23,
  },
  {
    id: 'ma-shan-zheng',
    name: '马善政毛笔',
    fontFamily: '"Ma Shan Zheng", "KaiTi", cursive',
    cssClass: 'hw-font-ma-shan-zheng',
    fontSize: 26,
  },
  {
    id: 'long-cang',
    name: '龙苍行书',
    fontFamily: '"Long Cang", "KaiTi", cursive',
    cssClass: 'hw-font-long-cang',
    fontSize: 24,
  },
  {
    id: 'zhi-mang-xing',
    name: '志芒星',
    fontFamily: '"Zhi Mang Xing", "KaiTi", cursive',
    cssClass: 'hw-font-zhi-mang-xing',
    fontSize: 24,
  },
  {
    id: 'liu-jian-mao-cao',
    name: '刘建毛草',
    fontFamily: '"Liu Jian Mao Cao", "KaiTi", cursive',
    cssClass: 'hw-font-liu-jian-mao-cao',
    fontSize: 26,
  },
  {
    id: 'zcool-kuaile',
    name: '站酷快乐体',
    fontFamily: '"ZCOOL KuaiLe", "KaiTi", cursive',
    cssClass: 'hw-font-zcool-kuaile',
    fontSize: 24,
  },
  {
    id: 'yuji-boku',
    name: '佑字朴',
    fontFamily: '"Yuji Boku", "LXGW WenKai", "KaiTi", serif',
    cssClass: 'hw-font-yuji-boku',
    fontSize: 23,
  },
  {
    id: 'yuji-mai',
    name: '佑字麦',
    fontFamily: '"Yuji Mai", "LXGW WenKai", "KaiTi", serif',
    cssClass: 'hw-font-yuji-mai',
    fontSize: 23,
  },
]

export const FONT_IDS: FontId[] = FONT_PRESETS.map((f) => f.id)

export function getFontPreset(fontId: FontId): FontPreset {
  return FONT_PRESETS.find((f) => f.id === fontId) ?? FONT_PRESETS[0]
}
