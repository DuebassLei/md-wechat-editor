export type GfmToolbarActionId =
  | 'h2'
  | 'h3'
  | 'bold'
  | 'list'
  | 'quote'
  | 'link'
  | 'image'
  | 'code'

export interface GfmToolbarAction {
  id: GfmToolbarActionId
  label: string
  title: string
  ariaLabel: string
}

export const GFM_TOOLBAR_ACTIONS: GfmToolbarAction[] = [
  { id: 'h2', label: 'H2', title: '二级标题', ariaLabel: '插入二级标题' },
  { id: 'h3', label: 'H3', title: '三级标题', ariaLabel: '插入三级标题' },
  { id: 'bold', label: '粗体', title: '粗体 **text** (Ctrl+B)', ariaLabel: '粗体' },
  { id: 'list', label: '列表', title: '无序列表 (Ctrl+Shift+7)', ariaLabel: '无序列表' },
  { id: 'quote', label: '引用', title: '引用块 (Ctrl+Shift+8)', ariaLabel: '引用' },
  { id: 'link', label: '链接', title: 'Markdown 链接 (Ctrl+K)', ariaLabel: '插入链接' },
  { id: 'image', label: '图片', title: '图片语法', ariaLabel: '插入图片' },
  { id: 'code', label: '代码', title: '代码块 (Ctrl+Shift+C)', ariaLabel: '代码块' },
]
