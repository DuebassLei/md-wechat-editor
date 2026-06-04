<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppShell from '@/components/AppShell.vue'
import HandwritingToolbar from '@/components/handwriting/HandwritingToolbar.vue'
import HandwritingLayoutControls from '@/components/handwriting/HandwritingLayoutControls.vue'
import HandwritingPaperPicker from '@/components/handwriting/HandwritingPaperPicker.vue'
import HandwritingPreview from '@/components/handwriting/HandwritingPreview.vue'
import HandwritingTextForm from '@/components/handwriting/HandwritingTextForm.vue'
import { useHandwritingContent } from '@/composables/useHandwritingContent'
import { applyTypoSimulation, hasExportableText } from '@/engine/handwriting/typoSimulation'
import { getPaperPreset } from '@/engine/handwriting/paperPresets'
import '@/styles/handwriting-fonts.css'

const { text, paperId, paperStyleId, fontId, typography, loadSample, clearAll, selectPaper, patchTypography, resetTypography } = useHandwritingContent()

const zoom = ref(0.5)
const previewRef = ref<InstanceType<typeof HandwritingPreview> | null>(null)
const debouncedText = ref(text.value)

let debounceTimer: ReturnType<typeof setTimeout> | undefined
watch(text, (v) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { debouncedText.value = v }, 300)
}, { immediate: true })

const displayText = computed(() => applyTypoSimulation(debouncedText.value).displayText)
const canExport = computed(() => hasExportableText(debouncedText.value))
const paperName = computed(() => getPaperPreset(paperId.value).name)
const sheetEl = computed(() => previewRef.value?.sheetEl ?? null)

function onSelectPaper(id: typeof paperId.value, styleId: string) {
  selectPaper(id, styleId)
}

function onClear() {
  if (confirm('确定清空所有内容与样式？')) clearAll()
}
</script>

<template>
  <AppShell studio>
    <div class="flex min-h-0 flex-1 flex-col">
      <HandwritingToolbar
        v-model:zoom="zoom"
        :sheet-el="sheetEl"
        :paper-name="paperName"
        :can-export="canExport"
        @clear="onClear"
      />
      <div class="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[260px_1fr_300px]">
        <div class="flex min-h-0 flex-col overflow-hidden border-r border-paper-line">
          <HandwritingPaperPicker
            class="min-h-0 flex-1 overflow-y-auto"
            :paper-id="paperId"
            :paper-style-id="paperStyleId"
            :font-id="fontId"
            @select-paper="onSelectPaper"
            @select-font="fontId = $event"
          />
          <HandwritingLayoutControls
            :typography="typography"
            @patch="patchTypography"
            @reset="resetTypography"
          />
        </div>
        <HandwritingPreview
          ref="previewRef"
          :display-text="displayText"
          :paper-id="paperId"
          :paper-style-id="paperStyleId"
          :font-id="fontId"
          :typography="typography"
          :zoom="zoom"
        />
        <HandwritingTextForm
          :text="text"
          @update:text="text = $event"
          @sample="loadSample"
        />
      </div>
    </div>
  </AppShell>
</template>
