<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
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
  buildJuejinArticleHtml,
  buildPlatformMarkdown,
  buildWechatArticleHtml,
  buildZhihuArticleHtml,
  copyPlainText,
  markdownUsesLayoutModules,
  OPEN_RENDER_ENTITLEMENTS,
  stripEditorSyncAttributes,
  usesRichLayout,
  type PlatformExportResult,
  type PlatformTarget,
  type ThemeId,
} from '@/engine'
import { useEditorPreviewSync } from '@/composables/useEditorPreviewSync'
import { copyRichText, preloadJuice } from '@/utils/wechatCopy'
import { normalizeThemeId } from '@/types/theme'
import PlatformCopyConfirmModal from '@/components/PlatformCopyConfirmModal.vue'
import PlatformCopyIconButton from '@/components/PlatformCopyIconButton.vue'
import XhsExporterModal from '@/components/XhsExporterModal.vue'
import WechatTietuExporterModal from '@/components/WechatTietuExporterModal.vue'
import { resolveImageTokens } from '@/engine/image-pipeline/imageTokens'
import {
  isImageHostConfigured,
  publishMarkdownWithHostUrls,
} from '@/engine/image-pipeline/publishResolve'
import { useImageHostSettings } from '@/composables/useImageHostSettings'

const content = defineModel<string>({ required: true })
const themeId = defineModel<ThemeId>('themeId', { default: 'normal' })

const emit = defineEmits<{
  openDocs: []
}>()

const { settings: imageHostSettings } = useImageHostSettings()
const mobileTab = ref<'edit' | 'preview'>('edit')
const copying = ref(false)
const copyingWithHost = ref(false)
const copyingPlatform = ref<PlatformTarget | 'zhihu' | null>(null)
const confirmOpen = ref(false)
const pendingExport = ref<PlatformExportResult | null>(null)
const pendingPlatform = ref<PlatformTarget>('juejin')
const toast = ref('')
const editorRef = ref<InstanceType<typeof MarkdownEditor> | null>(null)
const previewFrameRef = ref<InstanceType<typeof WechatPreviewFrame> | null>(null)
const xhsVisible = ref(false)
const wechatTietuVisible = ref(false)
const sideBySide = ref(false)
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

const previewContentWidth = computed(() => {
  const root = previewFrameRef.value?.rootEl
  if (!root) return 375
  const body = root.querySelector<HTMLElement>('.preview-body')
  const w = body?.clientWidth ?? 0
  return w > 80 ? w : 375
})

const editorView = computed(() => editorRef.value?.editorView ?? null)

useEditorPreviewSync({
  editorView,
  getScrollRoot: () => {
    const root = previewFrameRef.value?.rootEl ?? null
    if (!root) return null
    const shell = root.querySelector<HTMLElement>('.wechat-shell__scroll')
    if (shell) return shell
    if (!root.classList.contains('preview-root--device')) return root
    return root
  },
  previewLoading: loading,
  previewHtml: html,
  sideBySide,
  previewLayoutKey: deviceShell,
  onRequestEditTab: () => {
    mobileTab.value = 'edit'
  },
})

let mqCleanup: (() => void) | null = null

onMounted(() => {
  preloadJuice()
  const mq = window.matchMedia('(min-width: 1024px)')
  sideBySide.value = mq.matches
  const onMq = () => {
    sideBySide.value = mq.matches
  }
  mq.addEventListener('change', onMq)
  mqCleanup = () => mq.removeEventListener('change', onMq)
})

onUnmounted(() => {
  mqCleanup?.()
})

async function copyHtml() {
  copying.value = true
  toast.value = ''
  try {
    const resolved = await resolveImageTokens(content.value)
    const full = await buildWechatArticleHtml(
      resolved,
      themeRef.value,
      OPEN_RENDER_ENTITLEMENTS,
      null,
      { editorSyncAnchors: false },
    )
    const ok = await copyRichText(stripEditorSyncAttributes(full))
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

async function copyHtmlWithHost() {
  if (!isImageHostConfigured(imageHostSettings.value)) {
    toast.value = '请先在编辑器图床设置中配置默认图床'
    setTimeout(() => { toast.value = '' }, 4000)
    return
  }
  copyingWithHost.value = true
  toast.value = ''
  try {
    const { markdown, failed, uploaded } = await publishMarkdownWithHostUrls(
      content.value,
      imageHostSettings.value,
      { useCache: true },
    )
    if (failed.length) {
      toast.value = `有 ${failed.length} 张本地图片上传失败，请检查图床配置`
      return
    }
    if (uploaded > 0 || markdown !== content.value) {
      content.value = markdown
    }
    const resolved = await resolveImageTokens(markdown)
    const full = await buildWechatArticleHtml(
      resolved,
      themeRef.value,
      OPEN_RENDER_ENTITLEMENTS,
      null,
      { editorSyncAnchors: false },
    )
    const ok = await copyRichText(stripEditorSyncAttributes(full))
    toast.value = ok
      ? `已上传 ${uploaded} 张图并复制到剪贴板`
      : '复制失败，请检查浏览器权限'
  } catch (e) {
    toast.value = e instanceof Error ? e.message : '上传或复制失败'
  } finally {
    copyingWithHost.value = false
    setTimeout(() => { toast.value = '' }, 4000)
  }
}

function onImageError(message: string) {
  toast.value = message
  setTimeout(() => { toast.value = '' }, 4000)
}

async function copyJuejinHtml() {
  if (!content.value.trim()) {
    showToastLater('内容为空')
    return
  }
  copyingPlatform.value = 'juejin'
  toast.value = ''
  try {
    const full = await buildJuejinArticleHtml(
      content.value,
      themeRef.value,
      OPEN_RENDER_ENTITLEMENTS,
      null,
      { editorSyncAnchors: false },
    )
    const ok = await copyRichText(stripEditorSyncAttributes(full))
    showToastLater(
      ok ? '已复制掘金 HTML（含主题样式），可到掘金编辑器粘贴' : '复制失败，请检查浏览器权限',
    )
  } catch (e) {
    showToastLater(e instanceof Error ? e.message : '复制失败')
  } finally {
    copyingPlatform.value = null
  }
}

async function copyZhihuHtml() {
  if (!content.value.trim()) {
    showToastLater('内容为空')
    return
  }
  copyingPlatform.value = 'zhihu'
  toast.value = ''
  try {
    const full = await buildZhihuArticleHtml(
      content.value,
      themeRef.value,
      OPEN_RENDER_ENTITLEMENTS,
      null,
      { editorSyncAnchors: false },
    )
    const ok = await copyRichText(stripEditorSyncAttributes(full))
    showToastLater(
      ok ? '已复制知乎 HTML（含主题样式），可到知乎编辑器粘贴' : '复制失败，请检查浏览器权限',
    )
  } catch (e) {
    showToastLater(e instanceof Error ? e.message : '复制失败')
  } finally {
    copyingPlatform.value = null
  }
}

function sourceExcerpt(md: string, maxLines = 12): string {
  return md.split('\n').slice(0, maxLines).join('\n')
}

function showToastLater(msg: string) {
  toast.value = msg
  setTimeout(() => {
    toast.value = ''
  }, 4000)
}

async function finalizePlatformCopy(platform: PlatformTarget, result: PlatformExportResult) {
  if (!result.markdown.trim()) {
    showToastLater('降级结果为空，无法复制')
    return
  }
  copyingPlatform.value = platform
  const ok = await copyPlainText(result.markdown)
  const label = platform === 'juejin' ? '掘金' : 'CSDN'
  showToastLater(
    ok ? `已复制${label} Markdown，可到${label}编辑器粘贴` : '复制失败，请检查浏览器权限',
  )
  copyingPlatform.value = null
}

async function copyPlatformMarkdown(platform: PlatformTarget) {
  if (!content.value.trim()) {
    showToastLater('内容为空')
    return
  }
  toast.value = ''
  const result = buildPlatformMarkdown(content.value, platform)

  if (markdownUsesLayoutModules(content.value)) {
    pendingExport.value = result
    pendingPlatform.value = platform
    confirmOpen.value = true
    return
  }

  await finalizePlatformCopy(platform, result)
}

function onConfirmPlatformCopy() {
  if (!pendingExport.value || !pendingPlatform.value) return
  void finalizePlatformCopy(pendingPlatform.value, pendingExport.value)
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
        <PlatformCopyIconButton
          platform="wechat"
          :loading="copying"
          :disabled="copying || copyingWithHost || copyingPlatform !== null"
          title="复制公众号 HTML"
          @click="copyHtml"
        />
        <button
          type="button"
          class="btn-ghost btn-sm hidden sm:inline-flex"
          :disabled="copying || copyingWithHost || copyingPlatform !== null"
          title="先将本地图上传图床，再复制公众号 HTML"
          @click="copyHtmlWithHost"
        >
          {{ copyingWithHost ? '上传中…' : '图床复制' }}
        </button>
        <PlatformCopyIconButton
          platform="juejin"
          :loading="copyingPlatform === 'juejin'"
          :disabled="copying || copyingPlatform !== null"
          title="复制掘金 HTML（保留主题样式）"
          @click="copyJuejinHtml"
        />
        <PlatformCopyIconButton
          platform="zhihu"
          :loading="copyingPlatform === 'zhihu'"
          :disabled="copying || copyingPlatform !== null"
          title="复制知乎 HTML（保留主题样式）"
          @click="copyZhihuHtml"
        />
        <PlatformCopyIconButton
          platform="csdn"
          :loading="copyingPlatform === 'csdn'"
          :disabled="copying || copyingPlatform !== null"
          title="复制 CSDN Markdown"
          @click="copyPlatformMarkdown('csdn')"
        />
        <PlatformCopyIconButton
          platform="xhs"
          title="导出小红书图（首图 + 自动分页内容图）"
          @click="xhsVisible = true"
        />
        <PlatformCopyIconButton
          platform="wechat-tietu"
          title="导出微信贴图（3:4 首图 + 自动分页，支持上传优化）"
          @click="wechatTietuVisible = true"
        />
      </div>
    </div>
    <XhsExporterModal
      :visible="xhsVisible"
      :markdown="content"
      :theme-id="themeRef"
      :preview-content-width="previewContentWidth"
      @close="xhsVisible = false"
    />
    <WechatTietuExporterModal
      :visible="wechatTietuVisible"
      :markdown="content"
      :theme-id="themeRef"
      :preview-content-width="previewContentWidth"
      @close="wechatTietuVisible = false"
    />
    <PlatformCopyConfirmModal
      v-if="pendingExport"
      v-model:open="confirmOpen"
      :platform="pendingPlatform"
      :source-excerpt="sourceExcerpt(content)"
      :preview-markdown="pendingExport.markdown"
      :report="pendingExport.report"
      :empty-preview="!pendingExport.markdown.trim()"
      @confirm="onConfirmPlatformCopy"
    />
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
        <MarkdownEditor ref="editorRef" v-model="content" fill-height @image-error="onImageError" />
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
          ref="previewFrameRef"
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
