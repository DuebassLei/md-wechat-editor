import { ref } from 'vue'
import type { EditorView } from '@codemirror/view'
import {
  cleanupUnusedImageTokens,
  countImageTokens,
  importLocalImage,
} from '@/engine/image-pipeline'
import { encodePublishJpegFromFile } from '@/engine/image-pipeline/encodePublishJpeg'
import { uploadImage } from '@/engine/image-upload/uploadImage'
import { insertTextInView } from '@/composables/useCodeMirrorMarkdown'
import { notifyLocalImagesChanged } from '@/composables/usePreviewHtml'
import { useImageHostSettings } from '@/composables/useImageHostSettings'

function altFromFilename(name: string): string {
  const base = name.replace(/\.[^.]+$/, '').trim()
  return base || '图片'
}

export function useImageImport() {
  const { settings } = useImageHostSettings()
  const importing = ref(false)
  const importError = ref('')

  async function insertMarkdown(view: EditorView | null, markdown: string) {
    if (view) {
      insertTextInView(view, markdown)
    }
    return markdown
  }

  async function importLocalFiles(files: FileList | File[], view: EditorView | null, markdown: string) {
    const list = Array.from(files)
    if (!list.length) return

    importing.value = true
    importError.value = ''

    try {
      let tokenCount = countImageTokens(markdown)
      for (const file of list) {
        const result = await importLocalImage(file, tokenCount)
        await insertMarkdown(view, `\n${result.markdown}\n`)
        tokenCount++
      }
      const readMarkdown = () => view?.state.doc.toString() ?? markdown
      const scheduleCleanup = window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 800))
      scheduleCleanup(() => void cleanupUnusedImageTokens(readMarkdown()))
      notifyLocalImagesChanged()
    } catch (e) {
      importError.value = e instanceof Error ? e.message : '导入失败'
      throw e
    } finally {
      importing.value = false
    }
  }

  async function uploadHostFiles(
    files: FileList | File[],
    view: EditorView | null,
  ) {
    const list = Array.from(files)
    if (!list.length) return

    importing.value = true
    importError.value = ''

    try {
      for (const file of list) {
        const encoded = await encodePublishJpegFromFile(file)
        if (!encoded.ok) throw new Error('图片过大，请裁剪后重试')
        const alt = altFromFilename(file.name)
        const { url } = await uploadImage(
          encoded.blob,
          `${alt}.jpg`,
          settings.value,
        )
        await insertMarkdown(view, `\n![${alt}](${url})\n`)
      }
    } catch (e) {
      importError.value = e instanceof Error ? e.message : '上传失败'
      throw e
    } finally {
      importing.value = false
    }
  }

  return {
    importing,
    importError,
    importLocalFiles,
    uploadHostFiles,
  }
}
