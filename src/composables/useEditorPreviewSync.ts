import { watch, onUnmounted, nextTick, type Ref } from 'vue'
import { EditorView } from '@codemirror/view'
import {
  buildAnchorTable,
  lineToAnchor,
  anchorAtPreviewCenter,
  scrollPreviewToAnchor,
  type SyncAnchor,
} from './editorPreviewSync/anchorTable'

export function useEditorPreviewSync(options: {
  editorView: Ref<EditorView | null | undefined>
  getScrollRoot: () => HTMLElement | null
  previewLoading: Ref<boolean>
  previewHtml: Ref<string>
  sideBySide: Ref<boolean>
  /** 套壳/平铺切换时重建锚点 */
  previewLayoutKey?: Ref<unknown>
  onRequestEditTab: () => void
}) {
  let anchors: SyncAnchor[] = []
  let syncing: 'editor' | 'preview' | null = null
  let rafScroll = 0
  let selTimer: ReturnType<typeof setTimeout> | null = null
  let activeEl: Element | null = null
  let editorScrollEl: HTMLElement | null = null
  let previewScrollEl: HTMLElement | null = null

  function rebuildAnchors() {
    const root = options.getScrollRoot()
    if (!root) {
      anchors = []
      return
    }
    anchors = buildAnchorTable(root)
  }

  function setActive(anchor: SyncAnchor | null) {
    if (activeEl) activeEl.classList.remove('preview-sync-active')
    activeEl = anchor?.el ?? null
    activeEl?.classList.add('preview-sync-active')
  }

  function withSync(side: 'editor' | 'preview', fn: () => void) {
    syncing = side
    fn()
    requestAnimationFrame(() => {
      syncing = null
    })
  }

  function cursorLine(view: EditorView): number {
    const pos = view.state.selection.main.head
    return view.state.doc.lineAt(pos).number
  }

  function centerLine(view: EditorView): number {
    const scrollDOM = view.scrollDOM
    const mid = scrollDOM.scrollTop + scrollDOM.clientHeight / 2
    const block = view.lineBlockAtHeight(mid)
    return view.state.doc.lineAt(block.from).number
  }

  function syncFromEditor(scrollOnly = false) {
    const view = options.editorView.value
    const root = options.getScrollRoot()
    if (!view || !root || options.previewLoading.value || !anchors.length) return
    const line = scrollOnly ? centerLine(view) : cursorLine(view)
    const anchor = lineToAnchor(anchors, line)
    if (!anchor) return
    withSync('editor', () => scrollPreviewToAnchor(root, anchor))
    if (!scrollOnly) setActive(anchor)
  }

  function syncFromPreview() {
    const view = options.editorView.value
    const root = options.getScrollRoot()
    if (!view || !root || syncing === 'editor' || !anchors.length) return
    const anchor = anchorAtPreviewCenter(anchors, root)
    if (!anchor) return
    const lineObj = view.state.doc.line(Math.min(anchor.line, view.state.doc.lines))
    withSync('preview', () => {
      view.dispatch({
        effects: EditorView.scrollIntoView(lineObj.from, { y: 'center' }),
      })
    })
    setActive(anchor)
  }

  function onPreviewClick(e: MouseEvent) {
    const t = (e.target as Element).closest('[data-md-line-start]')
    if (!t) return
    const line = Number((t as HTMLElement).dataset.mdLineStart)
    const view = options.editorView.value
    if (!view || !Number.isFinite(line)) return
    options.onRequestEditTab()
    const lineNo = Math.min(Math.max(1, line), view.state.doc.lines)
    const lineObj = view.state.doc.line(lineNo)
    view.dispatch({
      selection: { anchor: lineObj.from },
      effects: EditorView.scrollIntoView(lineObj.from, { y: 'center' }),
    })
    view.focus()
    void nextTick(() => syncFromEditor(false))
  }

  function onEditorScroll() {
    if (!options.sideBySide.value || syncing === 'preview') return
    cancelAnimationFrame(rafScroll)
    rafScroll = requestAnimationFrame(() => syncFromEditor(true))
  }

  function onPreviewScroll() {
    if (!options.sideBySide.value || syncing === 'editor') return
    cancelAnimationFrame(rafScroll)
    rafScroll = requestAnimationFrame(() => syncFromPreview())
  }

  function onSelectionChange() {
    if (selTimer) clearTimeout(selTimer)
    selTimer = setTimeout(() => syncFromEditor(false), 50)
  }

  function detachListeners() {
    editorScrollEl?.removeEventListener('scroll', onEditorScroll)
    previewScrollEl?.removeEventListener('scroll', onPreviewScroll)
    previewScrollEl?.removeEventListener('click', onPreviewClick)
    editorScrollEl = null
    previewScrollEl = null
  }

  function attachListeners() {
    detachListeners()
    const view = options.editorView.value
    const root = options.getScrollRoot()
    if (!view || !root) return

    editorScrollEl = view.scrollDOM
    previewScrollEl = root
    previewScrollEl.addEventListener('click', onPreviewClick)
    if (options.sideBySide.value) {
      editorScrollEl.addEventListener('scroll', onEditorScroll, { passive: true })
      previewScrollEl.addEventListener('scroll', onPreviewScroll, { passive: true })
    }
  }

  function bindEditorSelection(view: EditorView) {
    const onActivity = () => onSelectionChange()
    view.contentDOM.addEventListener('keyup', onActivity)
    view.contentDOM.addEventListener('mouseup', onActivity)
    return () => {
      view.contentDOM.removeEventListener('keyup', onActivity)
      view.contentDOM.removeEventListener('mouseup', onActivity)
    }
  }

  let unbindSelection: (() => void) | null = null

  watch(
    () => options.editorView.value,
    (view) => {
      unbindSelection?.()
      unbindSelection = null
      detachListeners()
      if (!view) return
      unbindSelection = bindEditorSelection(view)
      attachListeners()
    },
    { immediate: true },
  )

  const layoutWatch = options.previewLayoutKey
    ? [options.previewHtml, options.previewLoading, options.sideBySide, options.previewLayoutKey]
    : [options.previewHtml, options.previewLoading, options.sideBySide]

  watch(
    layoutWatch,
    async () => {
      if (options.previewLoading.value) return
      await nextTick()
      rebuildAnchors()
      attachListeners()
      syncFromEditor(false)
    },
  )

  onUnmounted(() => {
    unbindSelection?.()
    detachListeners()
    if (selTimer) clearTimeout(selTimer)
    if (activeEl) activeEl.classList.remove('preview-sync-active')
  })

  return { rebuildAnchors }
}
