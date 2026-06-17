<script setup lang="ts">
import { ref } from 'vue'
import { useImageHostSettings } from '@/composables/useImageHostSettings'
import type { ImageHostProviderId } from '@/engine/image-pipeline/types'
import { uploadImage } from '@/engine/image-upload/uploadImage'
import { encodePublishJpegFromFile } from '@/engine/image-pipeline/encodePublishJpeg'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { settings } = useImageHostSettings()
const testing = ref(false)
const testHint = ref('')

const providers: { id: ImageHostProviderId; label: string }[] = [
  { id: 'smms', label: 'SM.MS' },
  { id: 'imgbb', label: 'ImgBB' },
  { id: 'github', label: 'GitHub / jsDelivr' },
  { id: 'custom', label: '自定义 POST' },
]

function close() {
  emit('update:open', false)
}

async function testUpload() {
  testing.value = true
  testHint.value = ''
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 2
    canvas.height = 2
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('无法创建测试图')
    ctx.fillStyle = '#07c160'
    ctx.fillRect(0, 0, 2, 2)
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('编码失败'))), 'image/jpeg', 0.9)
    })
    const result = await uploadImage(blob, 'test.jpg', settings.value)
    testHint.value = result.url ? '测试上传成功' : '上传成功但未返回 URL'
  } catch (e) {
    testHint.value = e instanceof Error ? e.message : '测试失败'
  } finally {
    testing.value = false
  }
}

async function testEncodeOnly() {
  testing.value = true
  testHint.value = ''
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 8
    canvas.height = 8
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('无法创建测试图')
    ctx.fillStyle = '#c41e3a'
    ctx.fillRect(0, 0, 8, 8)
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('编码失败'))), 'image/png')
    })
    const file = new File([blob], 'test.png', { type: 'image/png' })
    const encoded = await encodePublishJpegFromFile(file)
    testHint.value = encoded.ok ? `编码测试通过（${encoded.bytes} 字节）` : '编码后仍超限'
  } catch (e) {
    testHint.value = e instanceof Error ? e.message : '编码测试失败'
  } finally {
    testing.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[280] flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
        role="presentation"
        @click.self="close"
      >
        <div
          class="card relative flex max-h-[min(92vh,640px)] w-full flex-col overflow-hidden shadow-card-hover sm:max-w-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="image-host-title"
          @click.stop
        >
          <header class="flex shrink-0 items-center justify-between border-b border-paper-line px-4 py-3">
            <p id="image-host-title" class="text-base font-semibold text-ink">图床设置</p>
            <button type="button" class="btn-ghost btn-sm !px-2" aria-label="关闭" @click="close">×</button>
          </header>

          <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
            <label class="block space-y-1.5">
              <span class="text-xs font-semibold text-ink-soft">默认图床</span>
              <select v-model="settings.defaultProviderId" class="input">
                <option v-for="p in providers" :key="p.id" :value="p.id">{{ p.label }}</option>
              </select>
            </label>

            <div v-if="settings.defaultProviderId === 'smms'" class="space-y-2">
              <label class="block space-y-1.5">
                <span class="text-xs font-semibold text-ink-soft">SM.MS Token（可选）</span>
                <input v-model="settings.smms.token" type="password" class="input" placeholder="留空使用匿名上传">
              </label>
              <p class="text-[11px] text-ink-muted">匿名上传有频率限制，建议配置 Token。</p>
            </div>

            <div v-if="settings.defaultProviderId === 'imgbb'" class="space-y-2">
              <label class="block space-y-1.5">
                <span class="text-xs font-semibold text-ink-soft">ImgBB API Key</span>
                <input v-model="settings.imgbb.apiKey" type="password" class="input" placeholder="必填">
              </label>
            </div>

            <div v-if="settings.defaultProviderId === 'github'" class="space-y-3">
              <label class="block space-y-1.5">
                <span class="text-xs font-semibold text-ink-soft">仓库（用户名/仓库名）</span>
                <input v-model="settings.github.repo" type="text" class="input" placeholder="user/repo">
              </label>
              <label class="block space-y-1.5">
                <span class="text-xs font-semibold text-ink-soft">Personal Access Token</span>
                <input v-model="settings.github.token" type="password" class="input">
              </label>
              <label class="block space-y-1.5">
                <span class="text-xs font-semibold text-ink-soft">分支</span>
                <input v-model="settings.github.branch" type="text" class="input" placeholder="main">
              </label>
            </div>

            <div v-if="settings.defaultProviderId === 'custom'" class="space-y-3">
              <label class="block space-y-1.5">
                <span class="text-xs font-semibold text-ink-soft">上传 URL</span>
                <input v-model="settings.custom.uploadUrl" type="url" class="input" placeholder="https://...">
              </label>
              <label class="block space-y-1.5">
                <span class="text-xs font-semibold text-ink-soft">文件字段名</span>
                <input v-model="settings.custom.fileField" type="text" class="input" placeholder="file">
              </label>
              <label class="block space-y-1.5">
                <span class="text-xs font-semibold text-ink-soft">响应 URL 路径</span>
                <input v-model="settings.custom.urlJsonPath" type="text" class="input" placeholder="data.url">
              </label>
              <div class="grid grid-cols-2 gap-2">
                <label class="block space-y-1.5">
                  <span class="text-xs font-semibold text-ink-soft">Header 名</span>
                  <input v-model="settings.custom.tokenHeader" type="text" class="input">
                </label>
                <label class="block space-y-1.5">
                  <span class="text-xs font-semibold text-ink-soft">Header 值</span>
                  <input v-model="settings.custom.tokenValue" type="password" class="input">
                </label>
              </div>
            </div>

            <p class="text-[11px] leading-relaxed text-ink-muted">
              本地插入的图片保存在浏览器图库；复制公众号时默认解析为内嵌图。若需正文使用 https 链接，请使用「上传图床并复制」。
            </p>

            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="btn-secondary btn-sm"
                :disabled="testing"
                @click="testUpload"
              >
                {{ testing ? '测试中…' : '测试图床上传' }}
              </button>
              <button type="button" class="btn-ghost btn-sm" :disabled="testing" @click="testEncodeOnly">
                测试图片编码
              </button>
            </div>
            <p v-if="testHint" class="text-xs text-ink-soft">{{ testHint }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
