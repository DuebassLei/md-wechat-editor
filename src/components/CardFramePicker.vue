<script setup lang="ts">
import {
  CARD_FRAME_GROUPS,
  CARD_FRAMES,
  type CardFrameId,
} from '@/engine/card-export/cardFrames'

const model = defineModel<CardFrameId>({ required: true })

const props = defineProps<{
  label?: string
  accent?: string
  storageKey?: string
}>()

const emit = defineEmits<{
  change: [id: CardFrameId]
}>()

const frameMap = new Map(CARD_FRAMES.map((f) => [f.id, f]))

/** 使用主题色晕染的样式 */
const ACCENT_FRAMES = new Set<CardFrameId>([
  'soft',
  'wechat',
  'glow',
  'comic',
  'sticker',
  'watercolor',
  'crayon',
  'tape',
  'stamp',
  'neon',
  'lineart',
  'sketch',
  'pixel',
  'ticket',
  'polaroid',
])

const accentColor = () => props.accent ?? '#E67E22'

function usesAccent(id: CardFrameId): boolean {
  return ACCENT_FRAMES.has(id)
}

function frameDef(id: CardFrameId) {
  return frameMap.get(id)!
}

function select(id: CardFrameId) {
  if (model.value === id) return
  model.value = id
  if (props.storageKey) sessionStorage.setItem(props.storageKey, id)
  emit('change', id)
}

function previewClass(id: CardFrameId): string {
  return `frame-picker__preview frame-picker__preview--${id}`
}
</script>

<template>
  <div class="frame-picker">
    <span v-if="label" class="frame-picker__label">{{ label }}</span>
    <div
      class="frame-picker__track"
      role="listbox"
      :aria-label="label ? `${label}选项` : '卡片样式'"
    >
      <template v-for="(g, gi) in CARD_FRAME_GROUPS" :key="g.label">
        <span
          v-if="gi > 0"
          class="frame-picker__sep"
          :title="g.label"
          aria-hidden="true"
        />
        <button
          v-for="id in g.ids"
          :key="id"
          type="button"
          class="frame-picker__chip"
          role="option"
          :aria-selected="model === id"
          :title="`${frameDef(id).label} · ${frameDef(id).desc}`"
          @click="select(id)"
        >
          <span
            class="frame-picker__thumb"
            :class="previewClass(id)"
            :style="usesAccent(id) ? { '--frame-accent': accentColor() } : undefined"
            aria-hidden="true"
          >
            <span class="frame-picker__thumb-inner" />
          </span>
          <span class="frame-picker__name">{{ frameDef(id).label }}</span>
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.frame-picker {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.frame-picker__label {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-ink-muted, #64748b);
}

.frame-picker__track {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: stretch;
  gap: 6px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 2px 1px 4px;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.frame-picker__sep {
  flex-shrink: 0;
  align-self: center;
  width: 1px;
  height: 44px;
  margin: 0 1px;
  background: var(--color-paper-line, #e8dfd0);
}

.frame-picker__chip {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 52px;
  padding: 6px 3px 4px;
  border-radius: 10px;
  border: 1px solid var(--color-paper-line, #e8dfd0);
  background: var(--color-paper-bright, #fffdf8);
  cursor: pointer;
  scroll-snap-align: start;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.12s ease;
}

.frame-picker__chip:hover {
  border-color: var(--color-jade, #0d9488);
  transform: translateY(-1px);
}

.frame-picker__chip[aria-selected='true'] {
  border-color: var(--color-jade, #0d9488);
  background: rgb(13 148 136 / 0.05);
  box-shadow: 0 2px 10px rgb(13 148 136 / 0.12);
}

.frame-picker__chip:focus-visible {
  outline: 2px solid var(--color-jade, #0d9488);
  outline-offset: 2px;
}

.frame-picker__thumb {
  --xhs-canvas: #f7f2e8;
  --xhs-card: #fff;
  position: relative;
  width: 36px;
  height: 46px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--xhs-canvas);
}

.frame-picker__thumb-inner {
  position: absolute;
  inset: 4px;
  border-radius: 5px;
  background: var(--xhs-card);
  box-shadow: 0 2px 8px rgb(31 26 23 / 0.08);
}

/* 默认小红书浮卡 */
.frame-picker__preview:not([class*='--none']):not([class*='--glow']):not([class*='--neon']):not([class*='--film']):not([class*='--chalk'])
  .frame-picker__thumb-inner {
  inset: 5px;
  border: 1px solid #e8dfd0;
  border-radius: 6px;
}

.frame-picker__preview--none {
  background: linear-gradient(165deg, #faf8f5, #fff);
}
.frame-picker__preview--none .frame-picker__thumb-inner {
  inset: 4px;
  border: none;
  box-shadow: none;
}

/* 奶油留白 */
.frame-picker__preview--soft {
  background: linear-gradient(168deg, #f7f2e8, #faf6ef);
}
.frame-picker__preview--soft::before {
  content: '';
  position: absolute;
  left: -2px;
  top: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--frame-accent) 22%, transparent);
  filter: blur(3px);
}

/* 柔光贴纸 */
.frame-picker__preview--sticker {
  background: linear-gradient(145deg, color-mix(in srgb, var(--frame-accent) 18%, #f7f2e8), #faf6ef);
}
.frame-picker__preview--sticker .frame-picker__thumb-inner {
  box-shadow:
    0 0 0 1.5px color-mix(in srgb, var(--frame-accent) 45%, #fff),
    0 3px 10px color-mix(in srgb, var(--frame-accent) 20%, transparent);
}

/* 融光晕染 */
.frame-picker__preview--watercolor::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--frame-accent) 30%, #f5d0c5);
  filter: blur(4px);
}

/* 杂志复古 */
.frame-picker__preview--classic {
  background: linear-gradient(165deg, #f5ede4, #ebe0d4);
}
.frame-picker__preview--classic .frame-picker__thumb-inner {
  border: 1.5px solid #d9c9ac;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.7);
}

/* 极简弧线 */
.frame-picker__preview--lineart .frame-picker__thumb-inner::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 7px;
  width: 14px;
  height: 2px;
  border-radius: 2px;
  background: var(--frame-accent);
  opacity: 0.75;
  transform: skewX(-12deg);
}

/* 相册留白 */
.frame-picker__preview--polaroid .frame-picker__thumb-inner {
  inset: 3px 4px 10px;
  border-radius: 3px;
}

/* 抹茶雾面 */
.frame-picker__preview--chalk {
  background: linear-gradient(165deg, #f5f8f6, #eef4f0);
}

/* 莫兰迪笔记 */
.frame-picker__preview--notebook {
  background: #f7f2e8;
  background-image: repeating-linear-gradient(0deg, transparent, transparent 5px, #e8dfd0 5px, #e8dfd0 6px);
}
.frame-picker__preview--notebook::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #e8b4b4;
  opacity: 0.6;
}
.frame-picker__preview--notebook .frame-picker__thumb-inner {
  inset: 4px 4px 4px 9px;
}

/* 暮色 / 星河 */
.frame-picker__preview--glow,
.frame-picker__preview--neon {
  background: linear-gradient(175deg, #3d3548, #2a2435);
}
.frame-picker__preview--glow .frame-picker__thumb-inner,
.frame-picker__preview--neon .frame-picker__thumb-inner {
  border: 1px solid color-mix(in srgb, var(--frame-accent) 50%, transparent);
  box-shadow: 0 0 6px color-mix(in srgb, var(--frame-accent) 40%, transparent);
}

/* 清新绿调 */
.frame-picker__preview--wechat {
  background: linear-gradient(168deg, #e8f8ef, #f7f2e8);
}
.frame-picker__preview--wechat .frame-picker__thumb-inner::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background: var(--frame-accent);
  border-radius: 4px 4px 0 0;
}

/* 元气星芒 */
.frame-picker__preview--comic::after {
  content: '';
  position: absolute;
  right: 5px;
  top: 8px;
  width: 6px;
  height: 6px;
  background: var(--frame-accent);
  clip-path: polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%);
  opacity: 0.85;
}

/* 手帐铅笔 */
.frame-picker__preview--sketch .frame-picker__thumb-inner {
  border: 1.5px solid #5c5346;
  border-radius: 7px 5px 6px 4px;
  opacity: 0.9;
}

/* 马卡龙 */
.frame-picker__preview--crayon::after {
  content: '';
  position: absolute;
  left: 6px;
  bottom: 8px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--frame-accent);
  box-shadow:
    8px -4px 0 #f5b7b1,
    14px 2px 0 #aed6f1;
  opacity: 0.65;
}

/* 和纸胶带 */
.frame-picker__preview--tape::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 20px;
  height: 5px;
  background: color-mix(in srgb, var(--frame-accent) 45%, transparent);
  transform: rotate(-7deg);
  border-radius: 1px;
}

/* 印章 */
.frame-picker__preview--stamp::after {
  content: '';
  position: absolute;
  right: 4px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px dashed color-mix(in srgb, var(--frame-accent) 60%, transparent);
}

/* 票根 */
.frame-picker__preview--ticket .frame-picker__thumb-inner {
  border-style: dashed;
  border-color: #d9c9ac;
}

/* 格纹 */
.frame-picker__preview--pixel {
  background-color: #f7f2e8;
  background-image: radial-gradient(circle, #d9c9ac 0.5px, transparent 0.5px);
  background-size: 5px 5px;
}

/* 电影取景 */
.frame-picker__preview--film {
  background: #3d3548;
}
.frame-picker__preview--film .frame-picker__thumb-inner {
  inset: 4px 7px;
  box-shadow: inset 0 0 6px rgb(0 0 0 / 0.25);
}
.frame-picker__preview--film::before,
.frame-picker__preview--film::after {
  content: '';
  position: absolute;
  top: 3px;
  bottom: 3px;
  width: 3px;
  background: #2a2435;
}
.frame-picker__preview--film::before {
  left: 2px;
}
.frame-picker__preview--film::after {
  right: 2px;
}

.frame-picker__name {
  font-size: 9px;
  font-weight: 600;
  color: var(--color-ink-soft, #5c5346);
  text-align: center;
  line-height: 1.15;
}

.frame-picker__chip[aria-selected='true'] .frame-picker__name {
  color: var(--color-jade-dark, #0f766e);
}
</style>
