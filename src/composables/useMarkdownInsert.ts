import type { EditorView } from '@codemirror/view'
import { insertTextInView } from '@/composables/useCodeMirrorMarkdown'
import type { GfmToolbarActionId } from '@/composables/gfmToolbarActions'

const PLACEHOLDER = {
  text: '文字',
  linkText: '链接文字',
  imageAlt: '说明',
}

function prefixLines(view: EditorView, prefix: string) {
  const { from, to } = view.state.selection.main
  const doc = view.state.doc
  const startLine = doc.lineAt(from).number
  const endLine = doc.lineAt(to).number
  const changes: { from: number; insert: string }[] = []

  for (let n = startLine; n <= endLine; n++) {
    const line = doc.line(n)
    const lineText = line.text
    if (lineText.startsWith(prefix)) continue
    changes.push({ from: line.from, insert: prefix })
  }

  if (!changes.length) {
    insertTextInView(view, prefix)
    return
  }

  view.dispatch({ changes })
  view.focus()
}

function wrapSelection(view: EditorView, before: string, after: string, emptyText: string) {
  const { from, to } = view.state.selection.main
  const selected = view.state.sliceDoc(from, to)
  const text = selected || emptyText
  const insert = before + text + after
  view.dispatch({
    changes: { from, to, insert },
    selection: selected
      ? { anchor: from + insert.length }
      : { anchor: from + before.length, head: from + before.length + emptyText.length },
  })
  view.focus()
}

export function applyGfmToolbarAction(view: EditorView | null, actionId: GfmToolbarActionId) {
  if (!view) return

  switch (actionId) {
    case 'h2':
      prefixLines(view, '## ')
      break
    case 'h3':
      prefixLines(view, '### ')
      break
    case 'bold':
      wrapSelection(view, '**', '**', PLACEHOLDER.text)
      break
    case 'list':
      prefixLines(view, '- ')
      break
    case 'quote':
      prefixLines(view, '> ')
      break
    case 'link': {
      const { from, to } = view.state.selection.main
      const selected = view.state.sliceDoc(from, to)
      const label = selected || PLACEHOLDER.linkText
      const insert = `[${label}](https://)`
      const urlStart = from + label.length + 3
      view.dispatch({
        changes: { from, to, insert },
        selection: { anchor: urlStart, head: urlStart + 'https://'.length },
      })
      view.focus()
      break
    }
    case 'image': {
      const { from, to } = view.state.selection.main
      const insert = `![${PLACEHOLDER.imageAlt}](https://)`
      const altStart = from + 2
      view.dispatch({
        changes: { from, to, insert },
        selection: { anchor: altStart, head: altStart + PLACEHOLDER.imageAlt.length },
      })
      view.focus()
      break
    }
    case 'code': {
      const { from, to } = view.state.selection.main
      const selected = view.state.sliceDoc(from, to)
      if (selected.includes('\n')) {
        wrapSelection(view, '\n```\n', '\n```\n', 'code')
      } else {
        const body = selected || 'code'
        const insert = `\n\`\`\`\n${body}\n\`\`\`\n`
        view.dispatch({
          changes: { from, to, insert },
          selection: { anchor: from + insert.length },
        })
        view.focus()
      }
      break
    }
  }
}
