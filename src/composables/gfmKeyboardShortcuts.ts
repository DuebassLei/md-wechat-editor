import type { EditorView } from '@codemirror/view'
import { applyGfmToolbarAction } from '@/composables/useMarkdownInsert'
import type { GfmToolbarActionId } from '@/composables/gfmToolbarActions'

type ShortcutSpec = {
  key: string
  action: GfmToolbarActionId
}

export const GFM_KEYBOARD_SHORTCUTS: ShortcutSpec[] = [
  { key: 'Mod-b', action: 'bold' },
  { key: 'Mod-k', action: 'link' },
  { key: 'Mod-Shift-7', action: 'list' },
  { key: 'Mod-Shift-8', action: 'quote' },
  { key: 'Mod-Shift-c', action: 'code' },
]

export function gfmShortcutBindings() {
  return GFM_KEYBOARD_SHORTCUTS.map(({ key, action }) => ({
    key,
    run(view: EditorView) {
      applyGfmToolbarAction(view, action)
      return true
    },
  }))
}
