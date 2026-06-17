import type { EditorView } from '@codemirror/view'

export function createEditorImageHandlers(
  onFiles: (files: File[], view: EditorView) => void,
) {
  return {
    paste(event: ClipboardEvent, view: EditorView) {
      const items = event.clipboardData?.items
      if (!items) return false

      const imageFiles: File[] = []
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) imageFiles.push(file)
        }
      }

      if (!imageFiles.length) return false

      event.preventDefault()
      onFiles(imageFiles, view)
      return true
    },
    drop(event: DragEvent, view: EditorView) {
      const files = event.dataTransfer?.files
      if (!files?.length) return false

      const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
      if (!imageFiles.length) return false

      event.preventDefault()
      onFiles(imageFiles, view)
      return true
    },
  }
}
