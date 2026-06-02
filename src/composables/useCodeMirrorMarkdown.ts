import { markdown } from '@codemirror/lang-markdown'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { EditorState, type Extension } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, placeholder as cmPlaceholder } from '@codemirror/view'
import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { gfmShortcutBindings } from '@/composables/gfmKeyboardShortcuts'

export interface CodeMirrorInsertHandler {
  insertAtCursor(text: string): void
  focus(): void
}

export function inkCodeMirrorTheme(minHeight: string, fillHeight = false): Extension {
  return EditorView.theme(
    {
      '&': fillHeight ? { fontSize: '14px', height: '100%', maxHeight: '100%' } : { fontSize: '14px', minHeight },
      '&.cm-focused': { outline: 'none' },
      '.cm-scroller': {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        lineHeight: '1.65',
        ...(fillHeight ? { height: '100%', maxHeight: '100%', overflow: 'auto' } : {}),
      },
      '.cm-content': {
        padding: '16px 20px',
        color: 'rgb(var(--ink-rgb))',
        backgroundColor: 'rgb(var(--paper-bright-rgb))',
        caretColor: 'rgb(var(--cinnabar-rgb))',
      },
      '.cm-gutters': {
        backgroundColor: 'rgb(var(--paper-dim-rgb) / 0.98)',
        color: 'rgb(var(--ink-faint-rgb))',
        border: 'none',
        borderRight: '1px solid rgb(var(--paper-line-rgb))',
      },
      '.cm-cursor': { borderLeftColor: 'rgb(var(--cinnabar-rgb))' },
      '.cm-activeLine': { backgroundColor: 'rgb(var(--cinnabar-light-rgb) / 0.35)' },
      '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
        backgroundColor: 'rgb(var(--cinnabar-rgb) / 0.22) !important',
      },
    },
    { dark: false },
  )
}

export function insertTextInView(view: EditorView, insert: string) {
  const { from, to } = view.state.selection.main
  view.dispatch({
    changes: { from, to, insert },
    selection: { anchor: from + insert.length },
  })
  view.focus()
}

export function useCodeMirrorMarkdown(
  model: Ref<string>,
  host: Ref<HTMLElement | null>,
  options: {
    placeholder?: string
    minHeight?: string
    fillHeight?: boolean
    readOnly?: boolean
    lineNumbers?: boolean
    onCreate?: (handler: CodeMirrorInsertHandler, view: EditorView) => void
  } = {},
) {
  const viewRef = ref<EditorView | null>(null)
  let suppressExternalSync = false

  function createInsertHandler(view: EditorView): CodeMirrorInsertHandler {
    return {
      insertAtCursor(text: string) {
        insertTextInView(view, text)
      },
      focus() {
        view.focus()
      },
    }
  }

  function init() {
    if (!host.value || viewRef.value) return

    const extensions: Extension[] = [
      markdown(),
      history(),
      keymap.of([...gfmShortcutBindings(), ...defaultKeymap, ...historyKeymap]),
      EditorView.lineWrapping,
      inkCodeMirrorTheme(options.minHeight ?? '20rem', options.fillHeight),
      EditorView.updateListener.of((update) => {
        if (!update.docChanged) return
        const text = update.state.doc.toString()
        if (text !== model.value) {
          suppressExternalSync = true
          model.value = text
          queueMicrotask(() => {
            suppressExternalSync = false
          })
        }
      }),
    ]

    if (options.lineNumbers !== false) extensions.push(lineNumbers())
    if (options.placeholder) extensions.push(cmPlaceholder(options.placeholder))
    if (options.readOnly) extensions.push(EditorState.readOnly.of(true))

    const view = new EditorView({
      parent: host.value,
      state: EditorState.create({ doc: model.value, extensions }),
    })
    viewRef.value = view
    options.onCreate?.(createInsertHandler(view), view)
  }

  function destroy() {
    viewRef.value?.destroy()
    viewRef.value = null
  }

  onMounted(init)
  onUnmounted(destroy)

  watch(host, (el) => {
    if (el && !viewRef.value) init()
  })

  watch(model, (value) => {
    const view = viewRef.value
    if (!view || suppressExternalSync) return
    const current = view.state.doc.toString()
    if (value === current) return
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: value },
      selection: { anchor: value.length },
    })
  })

  return { view: viewRef as Ref<EditorView | null> }
}
