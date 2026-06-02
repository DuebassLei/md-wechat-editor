<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import LegacySyntaxBanner from '@/components/LegacySyntaxBanner.vue'
import { detectLegacyLayoutSyntax } from '@/utils/detectLegacyLayoutSyntax'
import { migrateLegacyLayoutSyntax } from '@/engine/migrate/legacyXmlToFenced'
import ThemePicker from '@/components/ThemePicker.vue'
import WechatPreviewFrame from '@/components/WechatPreviewFrame.vue'
import { usePreviewHtml } from '@/composables/usePreviewHtml'
import { usePreviewShell } from '@/composables/usePreviewShell'
import { STUDIO_SAMPLE_MARKDOWN } from '@/constants/studioSampleMarkdown'
import { MODULE_SAMPLE_MARKDOWN } from '@/constants/moduleSampleMarkdown'
import {
  buildWechatArticleHtml,
  OPEN_RENDER_ENTITLEMENTS,
  usesRichLayout,
  type ThemeId,
} from '@/engine'
import { copyRichText, preloadJuice } from '@/utils/wechatCopy'
import { normalizeThemeId } from '@/types/theme'

const content = defineModel<string>({ required: true })
const themeId = defineModel<ThemeId>('themeId', { default: 'normal' })

const emit = defineEmits<{
  openDocs: []
}>()

const mobileTab = ref<'edit' | 'preview'>('edit')
const copying = ref(false)
const toast = ref('')
const editorRef = ref<InstanceType<typeof MarkdownEditor> | null>(null)
const legacyDismissed = ref(
  typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('legacy-syntax-dismissed') === '1',
)
const legacyReport = ref(detectLegacyLayoutSyntax(''))
const migrateSkipped = ref<string[]>([])

let legacyDetectTimer: ReturnType<typeof setTimeout> | null = null
watch(
  content,
  (md) => {
    if (legacyDetectTimer) clearTimeout(legacyDetectTimer)
    legacyDetectTimer = setTimeout(() => {
      legacyReport.value = detectLegacyLayoutSyntax(md)
    }, 500)
  },
  { immediate: true },
)

const showLegacyBanner = computed(
  () => legacyReport.value.found && !legacyDismissed.value,
)

function dismissLegacyBanner() {
  legacyDismissed.value = true
  sessionStorage.setItem('legacy-syntax-dismissed', '1')
}

function migrateLegacySyntax() {
  const result = migrateLegacyLayoutSyntax(content.value)
  migrateSkipped.value = result.skipped
  if (!result.changed) {
    toast.value = '未找到可自动转换的 XML 标签'
    return
  }
  content.value = result.markdown
  legacyReport.value = detectLegacyLayoutSyntax(content.value)
  toast.value =
    result.skipped.length > 0
      ? `已转换部分标签；请手改：${result.skipped.join('、')}`
      : '已转换为 ::: 围栏语法'
}

const themeRef = computed({
  get: () => themeId.value,
  set: (v) => {
    themeId.value = normalizeThemeId(v)
  },
})

const { html, loading, error } = usePreviewHtml(content, themeRef)
const { deviceShell } = usePreviewShell()
const richLayout = computed(() => usesRichLayout(content.value))

async function copyHtml() {
  copying.value = true
  toast.value = ''
  try {
    const full = await buildWechatArticleHtml(
      content.value,
      themeRef.value,
      OPEN_RENDER_ENTITLEMENTS,
      null,
    )
    const ok = await copyRichText(full)
    toast.value = ok ? '已复制公众号 HTML，可到微信公众平台粘贴' : '复制失败，请检查浏览器权限'
  } catch (e) {
    toast.value = e instanceof Error ? e.message : '复制失败'
  } finally {
    copying.value = false
    setTimeout(() => {
      toast.value = ''
    }, 4000)
  }
}

function loadSample() {
  if (content.value.trim() && !confirm('将用样板 Markdown 替换当前内容，是否继续？')) {
    return
  }
  content.value = STUDIO_SAMPLE_MARKDOWN
}

function loadModuleSample() {
  if (content.value.trim() && !confirm('将用 ::: 排版全模块样板替换当前内容，是否继续？')) {
    return
  }
  content.value = MODULE_SAMPLE_MARKDOWN
}

function openSyntaxHandbook() {
  editorRef.value?.openSyntaxDrawer()
}

onMounted(() => {
  preloadJuice()
})
</script>

<template>
  <div class="workspace">
    <div class="workspace__toolbar">
      <div class="segmented-control lg:hidden" role="tablist">
        <button
          type="button"
          class="segmented-control__tab"
          role="tab"
          :aria-selected="mobileTab === 'edit'"
          @click="mobileTab = 'edit'"
        >
          编辑
        </button>
        <button
          type="button"
          class="segmented-control__tab"
          role="tab"
          :aria-selected="mobileTab === 'preview'"
          @click="mobileTab = 'preview'"
        >
          预览
        </button>
      </div>
      <div class="workspace__actions">
        <button type="button" class="btn-secondary btn-sm lg:hidden" @click="emit('openDocs')">文档</button>
        <ThemePicker v-model="themeRef" />
        <button type="button" class="btn-ghost btn-sm" @click="loadSample">语法样板</button>
        <button type="button" class="btn-ghost btn-sm" @click="loadModuleSample">排版样板</button>
        <button type="button" class="btn-primary btn-sm" :disabled="copying" @click="copyHtml">
          {{ copying ? '复制中…' : '复制公众号 HTML' }}
        </button>
      </div>
    </div>
    <LegacySyntaxBanner
      v-if="showLegacyBanner"
      :tags="legacyReport.tags"
      :skipped="migrateSkipped"
      @migrate="migrateLegacySyntax"
      @open-syntax="openSyntaxHandbook"
      @dismiss="dismissLegacyBanner"
    />
    <p v-if="toast" class="workspace__toast">{{ toast }}</p>
    <p v-if="error" class="alert-error mx-3">{{ error }}</p>
    <div class="workspace__panes">
      <section
        class="workspace__pane workspace__pane--editor"
        :class="{ 'workspace__pane--hidden-mobile': mobileTab !== 'edit' }"
      >
        <MarkdownEditor ref="editorRef" v-model="content" fill-height />
      </section>
      <section
        class="workspace__pane workspace__pane--preview"
        :class="{ 'workspace__pane--hidden-mobile': mobileTab !== 'preview' }"
      >
        <div class="preview-toolbar">
          <span class="preview-toolbar__label">预览模式</span>
          <div class="segmented-control" role="tablist" aria-label="预览模式">
            <button
              type="button"
              class="segmented-control__tab"
              role="tab"
              :aria-selected="deviceShell"
              @click="deviceShell = true"
            >
              套壳
            </button>
            <button
              type="button"
              class="segmented-control__tab"
              role="tab"
              :aria-selected="!deviceShell"
              @click="deviceShell = false"
            >
              平铺
            </button>
          </div>
        </div>
        <div v-if="loading" class="state-empty m-4">预览渲染中…</div>
        <WechatPreviewFrame
          v-else
          :html="html"
          :device-shell="deviceShell"
          :rich-layout="richLayout"
        />
      </section>
    </div>
  </div>
</template>

<style scoped>
.workspace {
  @apply flex min-h-0 flex-1 flex-col;
}
.workspace__toolbar {
  @apply relative z-30 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-paper-line bg-paper-bright/95 px-3 py-2 backdrop-blur-sm;
  isolation: isolate;
}
.workspace__actions {
  @apply flex flex-wrap items-center gap-2;
}
.workspace__toast {
  @apply shrink-0 px-4 py-1 text-center text-xs text-jade-dark;
}
.workspace__panes {
  @apply grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2;
}
.workspace__pane {
  @apply min-h-0 overflow-hidden border-paper-line lg:border-l;
}
.workspace__pane--editor {
  @apply lg:border-l-0;
}
.workspace__pane--preview {
  @apply flex min-h-0 flex-col overflow-hidden bg-paper-dim/40 lg:border-l;
}
.preview-toolbar {
  @apply flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-paper-line/80 bg-paper-bright/70 px-3 py-2 backdrop-blur-sm;
}
.preview-toolbar__label {
  @apply text-xs font-medium text-ink-muted;
}
.workspace__pane--preview :deep(.preview-root:not(.preview-root--device)) {
  @apply min-h-0 flex-1;
}
@media (max-width: 1023px) {
  .workspace__pane--hidden-mobile {
    display: none;
  }
}
</style>
