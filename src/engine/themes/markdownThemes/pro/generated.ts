/** 专业主题系列：Minimal / Focus / Elegant / Bold 精选变体（会员专享） */
function proThemeCss(accent: string, bg: string, name: string): string {
  return `/* ${name} — 专业主题 */
#nice { font-size: 16px; color: #1e293b; line-height: 1.75; }
#nice h1 { border-bottom: 2px solid ${accent}; padding-bottom: 0.4em; color: #0f172a; }
#nice h2 { border-left: 4px solid ${accent}; padding-left: 0.6em; color: #0f172a; }
#nice h3 { color: ${accent}; }
#nice a { color: ${accent}; text-decoration: none; border-bottom: 1px solid ${accent}40; }
#nice blockquote { border-left: 4px solid ${accent}; background: ${bg}; padding: 0.8em 1em; color: #475569; }
#nice code { color: ${accent}; background: ${bg}; padding: 0.15em 0.35em; border-radius: 4px; }
#nice pre { background: #0f172a; border-radius: 8px; }
#nice strong { color: #0f172a; }
#nice hr { border: none; border-top: 1px dashed ${accent}40; margin: 1.5em 0; }
#nice table { border-collapse: collapse; width: 100%; }
#nice th { background: ${bg}; color: ${accent}; border: 1px solid ${accent}30; padding: 8px; }
#nice td { border: 1px solid #e2e8f0; padding: 8px; }
`
}

export const PRO_THEME_DEFINITIONS = [
  { id: 'proMinimal01', name: '极简白', series: 'Minimal', accent: '#64748b', bg: '#f8fafc' },
  { id: 'proMinimal02', name: '极简灰', series: 'Minimal', accent: '#475569', bg: '#f1f5f9' },
  { id: 'proMinimal03', name: '极简暖', series: 'Minimal', accent: '#78716c', bg: '#fafaf9' },
  { id: 'proMinimal04', name: '极简蓝灰', series: 'Minimal', accent: '#5b6b7c', bg: '#f0f4f8' },
  { id: 'proFocus01', name: '聚焦靛蓝', series: 'Focus', accent: '#4f46e5', bg: '#eef2ff' },
  { id: 'proFocus02', name: '聚焦翠绿', series: 'Focus', accent: '#059669', bg: '#ecfdf5' },
  { id: 'proFocus03', name: '聚焦琥珀', series: 'Focus', accent: '#d97706', bg: '#fffbeb' },
  { id: 'proFocus04', name: '聚焦玫红', series: 'Focus', accent: '#db2777', bg: '#fdf2f8' },
  { id: 'proElegant01', name: '典雅金棕', series: 'Elegant', accent: '#92400e', bg: '#fef3c7' },
  { id: 'proElegant02', name: '典雅紫韵', series: 'Elegant', accent: '#7c3aed', bg: '#f5f3ff' },
  { id: 'proElegant03', name: '典雅青墨', series: 'Elegant', accent: '#0d9488', bg: '#f0fdfa' },
  { id: 'proElegant04', name: '典雅胭脂', series: 'Elegant', accent: '#be123c', bg: '#fff1f2' },
  { id: 'proBold01', name: '醒目橙', series: 'Bold', accent: '#ea580c', bg: '#fff7ed' },
  { id: 'proBold02', name: '醒目蓝', series: 'Bold', accent: '#2563eb', bg: '#eff6ff' },
  { id: 'proBold03', name: '醒目紫', series: 'Bold', accent: '#7c3aed', bg: '#ede9fe' },
  { id: 'proBold04', name: '醒目黑', series: 'Bold', accent: '#18181b', bg: '#f4f4f5' },
  { id: 'proBold05', name: '醒目红', series: 'Bold', accent: '#dc2626', bg: '#fef2f2' },
] as const

export const PRO_THEMES: Record<string, string> = Object.fromEntries(
  PRO_THEME_DEFINITIONS.map((t) => [t.id, proThemeCss(t.accent, t.bg, t.name)]),
)
