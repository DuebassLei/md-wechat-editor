/**
 * Timeline_DA02 - 竖向卡片时间线（会员 advanced）
 *
 * 语法与 DA01 相同，使用 :::timeline；渲染器在结果上增加左侧色条强调。
 */
import type { ThemeColors } from '../themeColors'
import { resolveColor } from '../utils/colorUtils'
import { leaf } from '../utils/helpers'
import { Timeline_DA01 } from './Timeline_DA01'

export const Timeline_DA02 = {
  id: 'Timeline_DA02',
  name: '时间线（竖向卡片）',
  tag: 'timeline',
  layoutTier: 'advanced' as const,
  attrs: [{ key: 'type', label: '样式', required: false, default: 'DA02' }],

  render(attrs: Record<string, string>, body: string, t: ThemeColors): string {
    const hex = resolveColor(attrs.color || t.accent)
    const inner = Timeline_DA01.render(attrs, body, t)
    if (!inner) return ''
    return inner.replace(
      'border-radius:16px;',
      `border-radius:16px;border-left:4px solid ${hex};`,
    )
  },
}
