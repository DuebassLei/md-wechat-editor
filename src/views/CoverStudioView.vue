<script setup lang="ts">
import { computed, ref } from 'vue'
import AppShell from '@/components/AppShell.vue'
import CoverEditorForm from '@/components/cover-editor/CoverEditorForm.vue'
import CoverEditorToolbar from '@/components/cover-editor/CoverEditorToolbar.vue'
import CoverPreview from '@/components/cover-editor/CoverPreview.vue'
import { useCoverEditorContent } from '@/composables/useCoverEditorContent'
import { downloadCoverBlob, exportCoverToBlob } from '@/engine/cover-editor/exportCover'
import '@/styles/cover-editor-fonts.css'

const {
  title,
  keywords,
  fontFamily,
  titleFontSize,
  keywordsFontSize,
  titleColor,
  keywordsColor,
  layout,
  aspect,
  bgPresetId,
  customBgImage,
  overlayOpacity,
  setCustomBgFromFile,
  clearCustomBg,
  resetAll,
} = useCoverEditorContent()

const previewRef = ref<InstanceType<typeof CoverPreview> | null>(null)
const zoom = ref(0.85)
const exporting = ref(false)
const status = ref('')
const uploadLabel = ref('')

const canExport = computed(() => Boolean(title.value.trim() || keywords.value.trim()))

function onUpload(file: File) {
  setCustomBgFromFile(file)
  uploadLabel.value = `已上传：${file.name}`
}

function onClearUpload() {
  clearCustomBg()
  uploadLabel.value = ''
}

function onReset() {
  if (confirm('确定重置所有设计选项？')) {
    resetAll()
    uploadLabel.value = ''
    status.value = ''
  }
}

async function onExport() {
  const el = previewRef.value?.coverCanvasEl ?? null
  if (!el || !canExport.value) return

  exporting.value = true
  status.value = ''
  const zoomWrap = el.parentElement
  const prevTransform = zoomWrap?.style.transform
  if (zoomWrap) zoomWrap.style.transform = 'none'

  try {
    const blob = await exportCoverToBlob(el, aspect.value)
    if (!blob) {
      status.value = '导出失败：无法生成图片'
      return
    }
    downloadCoverBlob(blob, aspect.value)
    status.value = '封面已下载'
  } catch {
    status.value = '导出失败，请重试'
  } finally {
    if (zoomWrap) zoomWrap.style.transform = prevTransform ?? ''
    exporting.value = false
  }
}
</script>

<template>
  <AppShell studio>
    <div class="flex min-h-0 flex-1 flex-col">
      <CoverEditorToolbar
        v-model:aspect="aspect"
        v-model:zoom="zoom"
        :can-export="canExport"
        :exporting="exporting"
        :status="status"
        @export="onExport"
        @reset="onReset"
      />
      <div class="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
        <CoverEditorForm
          v-model:title="title"
          v-model:keywords="keywords"
          v-model:font-family="fontFamily"
          v-model:title-font-size="titleFontSize"
          v-model:keywords-font-size="keywordsFontSize"
          v-model:title-color="titleColor"
          v-model:keywords-color="keywordsColor"
          v-model:layout="layout"
          v-model:bg-preset-id="bgPresetId"
          v-model:overlay-opacity="overlayOpacity"
          :custom-bg-image="customBgImage"
          :upload-label="uploadLabel"
          @upload="onUpload"
          @clear-upload="onClearUpload"
        />
        <CoverPreview
          ref="previewRef"
          :title="title"
          :keywords="keywords"
          :font-family="fontFamily"
          :title-font-size="titleFontSize"
          :keywords-font-size="keywordsFontSize"
          :title-color="titleColor"
          :keywords-color="keywordsColor"
          :layout="layout"
          :aspect="aspect"
          :bg-preset-id="bgPresetId"
          :custom-bg-image="customBgImage"
          :overlay-opacity="overlayOpacity"
          :zoom="zoom"
        />
      </div>
    </div>
  </AppShell>
</template>
