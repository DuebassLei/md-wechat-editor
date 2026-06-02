/** 组件配色预设：id 为 'theme' 表示跟随当前文章主题 */
export interface ComponentAccentPreset {
  id: string
  label: string
  color: string | null
}

export const COMPONENT_ACCENT_PRESETS: ComponentAccentPreset[] = [
  { id: 'theme', label: '跟随主题', color: null },
  { id: '#6c5ce7', label: '靛紫', color: '#6c5ce7' },
  { id: '#4f46e5', label: '靛蓝', color: '#4f46e5' },
  { id: '#2563eb', label: '海蓝', color: '#2563eb' },
  { id: '#0891b2', label: '青蓝', color: '#0891b2' },
  { id: '#16a34a', label: '翠绿', color: '#16a34a' },
  { id: '#ea580c', label: '暖橙', color: '#ea580c' },
  { id: '#dc2626', label: '朱红', color: '#dc2626' },
  { id: '#9333ea', label: '姹紫', color: '#9333ea' },
  { id: '#07c160', label: '微信绿', color: '#07c160' },
]

export function resolveComponentAccent(presetId: string): string | null {
  const preset = COMPONENT_ACCENT_PRESETS.find((p) => p.id === presetId)
  return preset?.color ?? null
}
