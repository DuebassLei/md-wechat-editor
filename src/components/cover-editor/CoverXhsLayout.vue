<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { CoverLayoutPreset } from '@/engine/cover-editor/types'

const props = defineProps<{
  preset: CoverLayoutPreset
  titleLines: string[]
  keywordsText: string
  titleStyle: CSSProperties
  keywordsStyle: CSSProperties
  customBgImage?: string
  mini?: boolean
}>()
</script>

<template>
  <div
    class="cover-xhs"
    :class="[`cover-xhs--${preset}`, mini ? 'cover-xhs--mini' : '']"
  >
    <!-- 早春出游：柠绿底 + 云朵相框 + 线稿花 -->
    <template v-if="preset === 'xhs-spring-outing'">
      <div class="cover-xhs__spring-tag" aria-hidden="true">SPRING IS COMING</div>
      <div class="cover-xhs__spring-title">
        <h2 class="cover-xhs__text cover-xhs__spring-heading" :style="titleStyle">
          <span v-for="(line, i) in titleLines" :key="i" class="cover-xhs__line">{{ line || ' ' }}</span>
        </h2>
      </div>
      <div class="cover-xhs__spring-photo" aria-hidden="true">
        <div
          v-if="customBgImage"
          class="cover-xhs__spring-photo-img"
          :style="{ backgroundImage: `url('${customBgImage}')` }"
        />
        <div v-else class="cover-xhs__spring-photo-placeholder" />
      </div>
      <div class="cover-xhs__spring-deco" aria-hidden="true">
        <span class="cover-xhs__flower cover-xhs__flower--1" />
        <span class="cover-xhs__flower cover-xhs__flower--2" />
        <span class="cover-xhs__flower cover-xhs__flower--3" />
        <span class="cover-xhs__spring-curve" />
      </div>
      <p v-if="keywordsText" class="cover-xhs__text cover-xhs__spring-foot" :style="keywordsStyle">
        {{ keywordsText }}
      </p>
    </template>

    <!-- 笔记本干货：蓝格底 + 活页纸 + 荧光标题 -->
    <template v-else-if="preset === 'xhs-notebook-dry'">
      <div class="cover-xhs__notebook-paper">
        <div class="cover-xhs__notebook-rings" aria-hidden="true">
          <span v-for="n in 6" :key="n" />
        </div>
        <div class="cover-xhs__notebook-inner">
          <h2 class="cover-xhs__text cover-xhs__notebook-title" :style="titleStyle">
            <span class="cover-xhs__notebook-highlight">
              <span v-for="(line, i) in titleLines" :key="i" class="cover-xhs__line">{{ line || ' ' }}</span>
            </span>
          </h2>
          <p
            v-if="keywordsText"
            class="cover-xhs__text cover-xhs__notebook-cta"
            :style="keywordsStyle"
          >
            {{ keywordsText }}
          </p>
          <div class="cover-xhs__notebook-lines" aria-hidden="true">
            <span class="cover-xhs__hl cover-xhs__hl--blue">数据分析</span>
            <span class="cover-xhs__hl cover-xhs__hl--yellow">引流模式</span>
            <span class="cover-xhs__notebook-arrow" />
          </div>
        </div>
      </div>
    </template>

    <!-- 浏览器 CTA：波点蓝 + 窗口卡片 -->
    <template v-else-if="preset === 'xhs-browser-cta'">
      <div class="cover-xhs__browser-window">
        <div class="cover-xhs__browser-bar" aria-hidden="true">
          <span class="cover-xhs__megaphone" />
          <span class="cover-xhs__browser-dots">
            <span /><span /><span />
          </span>
        </div>
        <h2 class="cover-xhs__text cover-xhs__browser-title" :style="titleStyle">
          <span v-for="(line, i) in titleLines" :key="i" class="cover-xhs__line">{{ line || ' ' }}</span>
        </h2>
        <p
          v-if="keywordsText"
          class="cover-xhs__text cover-xhs__browser-btn"
          :style="keywordsStyle"
        >
          {{ keywordsText }}
        </p>
        <span class="cover-xhs__browser-hand" aria-hidden="true" />
      </div>
    </template>

    <!-- 棕榈极简：沙色 + 叶影 + 白卡片 -->
    <template v-else-if="preset === 'xhs-palm-editorial'">
      <div class="cover-xhs__palm-shadow" aria-hidden="true" />
      <div class="cover-xhs__palm-card">
        <p class="cover-xhs__palm-brand" aria-hidden="true">REALLY GREAT BRAND</p>
        <h2 class="cover-xhs__text cover-xhs__palm-title" :style="titleStyle">
          <span v-for="(line, i) in titleLines" :key="i" class="cover-xhs__line">{{ line || ' ' }}</span>
        </h2>
        <p v-if="keywordsText" class="cover-xhs__text cover-xhs__palm-sub" :style="keywordsStyle">
          {{ keywordsText }}
        </p>
      </div>
    </template>

    <!-- 职场详情：青蓝渐变 + 喇叭 + 列表装饰 -->
    <template v-else-if="preset === 'xhs-detail-workplace'">
      <div class="cover-xhs__work-head">
        <h2 class="cover-xhs__text cover-xhs__work-title" :style="titleStyle">
          <span v-for="(line, i) in titleLines" :key="i" class="cover-xhs__line">{{ line || ' ' }}</span>
        </h2>
        <span class="cover-xhs__work-megaphone" aria-hidden="true" />
      </div>
      <p v-if="keywordsText" class="cover-xhs__text cover-xhs__work-sub" :style="keywordsStyle">
        {{ keywordsText }}
      </p>
      <div class="cover-xhs__work-list" aria-hidden="true">
        <div v-for="n in 3" :key="n" class="cover-xhs__work-item">
          <span class="cover-xhs__work-num">{{ n }}</span>
          <div class="cover-xhs__work-bars">
            <span class="cover-xhs__work-bar cover-xhs__work-bar--title" />
            <span class="cover-xhs__work-bar" />
            <span class="cover-xhs__work-bar cover-xhs__work-bar--short" />
          </div>
        </div>
      </div>
    </template>

    <!-- 自媒体详情：紫底 + 白卡片列表 -->
    <template v-else-if="preset === 'xhs-detail-media'">
      <div class="cover-xhs__media-shape cover-xhs__media-shape--1" aria-hidden="true" />
      <div class="cover-xhs__media-shape cover-xhs__media-shape--2" aria-hidden="true" />
      <h2 class="cover-xhs__text cover-xhs__media-title" :style="titleStyle">
        <span v-for="(line, i) in titleLines" :key="i" class="cover-xhs__line">{{ line || ' ' }}</span>
        <span class="cover-xhs__media-star" aria-hidden="true">✦</span>
      </h2>
      <div class="cover-xhs__media-card">
        <div v-for="n in 4" :key="n" class="cover-xhs__media-row" aria-hidden="true">
          <span class="cover-xhs__media-no">{{ String(n).padStart(2, '0') }}</span>
          <div class="cover-xhs__media-bars">
            <span class="cover-xhs__media-bar cover-xhs__media-bar--title" />
            <span class="cover-xhs__media-bar" />
          </div>
        </div>
        <p v-if="keywordsText" class="cover-xhs__text cover-xhs__media-kw" :style="keywordsStyle">
          {{ keywordsText }}
        </p>
      </div>
    </template>

    <!-- 孟菲斯详情：绿框 + 粗体标题 + STEP -->
    <template v-else-if="preset === 'xhs-detail-memphis'">
      <div class="cover-xhs__memphis-frame">
        <div class="cover-xhs__memphis-deco" aria-hidden="true">
          <span class="cover-xhs__memphis-heart" />
          <span class="cover-xhs__memphis-blob" />
        </div>
        <h2 class="cover-xhs__text cover-xhs__memphis-title" :style="titleStyle">
          <span v-for="(line, i) in titleLines" :key="i" class="cover-xhs__line">{{ line || ' ' }}</span>
        </h2>
        <div class="cover-xhs__memphis-steps" aria-hidden="true">
          <div v-for="n in 4" :key="n" class="cover-xhs__memphis-step">
            <span class="cover-xhs__memphis-step-tag">STEP{{ n }}</span>
            <span class="cover-xhs__memphis-step-line" />
          </div>
        </div>
        <p v-if="keywordsText" class="cover-xhs__text cover-xhs__memphis-kw" :style="keywordsStyle">
          {{ keywordsText }}
        </p>
      </div>
    </template>

    <!-- 手账详情：薄荷框 + 网格纸 + 笔刷标题 -->
    <template v-else-if="preset === 'xhs-detail-scrapbook'">
      <div class="cover-xhs__scrap-frame">
        <div class="cover-xhs__scrap-grid">
          <h2 class="cover-xhs__text cover-xhs__scrap-title" :style="titleStyle">
            <span v-for="(line, i) in titleLines" :key="i" class="cover-xhs__line">{{ line || ' ' }}</span>
          </h2>
          <div class="cover-xhs__scrap-sections" aria-hidden="true">
            <div v-for="n in 3" :key="n" class="cover-xhs__scrap-section">
              <span class="cover-xhs__scrap-brush" />
              <span class="cover-xhs__scrap-line" />
              <span class="cover-xhs__scrap-line cover-xhs__scrap-line--short" />
            </div>
          </div>
          <p v-if="keywordsText" class="cover-xhs__text cover-xhs__scrap-kw" :style="keywordsStyle">
            {{ keywordsText }}
          </p>
          <span class="cover-xhs__scrap-star cover-xhs__scrap-star--1" aria-hidden="true">★</span>
          <span class="cover-xhs__scrap-star cover-xhs__scrap-star--2" aria-hidden="true">★</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cover-xhs {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.cover-xhs__text {
  margin: 0;
  text-shadow: none;
}

.cover-xhs__line {
  display: block;
}

/* ── 早春出游 ── */
.cover-xhs--xhs-spring-outing {
  background: #c8e650;
}

.cover-xhs__spring-tag {
  position: absolute;
  top: 4%;
  left: 50%;
  transform: translateX(-50%) rotate(-8deg);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #1a1a1a;
  opacity: 0.75;
}

.cover-xhs__spring-heading {
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.cover-xhs__spring-title {
  position: absolute;
  top: 8%;
  left: 8%;
  z-index: 2;
  max-width: 55%;
}

.cover-xhs__spring-photo {
  position: absolute;
  top: 28%;
  left: 50%;
  transform: translateX(-50%);
  width: 72%;
  aspect-ratio: 1.05;
  z-index: 1;
}

.cover-xhs__spring-photo-placeholder,
.cover-xhs__spring-photo-img {
  width: 100%;
  height: 100%;
  border-radius: 45% 55% 52% 48% / 48% 45% 55% 52%;
  border: 3px solid #fff;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.12);
}

.cover-xhs__spring-photo-placeholder {
  background: linear-gradient(145deg, #ffe566 0%, #f5d020 100%);
}

.cover-xhs__spring-photo-img {
  background-size: cover;
  background-position: center;
}

.cover-xhs__spring-foot {
  position: absolute;
  bottom: 10%;
  left: 8%;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.cover-xhs__flower {
  position: absolute;
  border: 2px solid #1a1a1a;
  border-radius: 50%;
  background: #fff;
}

.cover-xhs__flower--1 {
  width: 14px;
  height: 14px;
  top: 22%;
  right: 12%;
}

.cover-xhs__flower--2 {
  width: 10px;
  height: 10px;
  bottom: 28%;
  left: 6%;
}

.cover-xhs__flower--3 {
  width: 8px;
  height: 8px;
  top: 18%;
  left: 42%;
  background: #f5d020;
}

.cover-xhs__spring-curve {
  position: absolute;
  bottom: 22%;
  right: 8%;
  width: 48px;
  height: 24px;
  border: 3px solid #f5d020;
  border-color: transparent #f5d020 #f5d020 transparent;
  border-radius: 0 0 100% 0;
  transform: rotate(-12deg);
}

/* ── 笔记本干货 ── */
.cover-xhs--xhs-notebook-dry {
  background-color: #b5daf3;
  background-image:
    linear-gradient(rgb(255 255 255 / 0.35) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 0.35) 1px, transparent 1px);
  background-size: 18px 18px;
}

.cover-xhs__notebook-paper {
  position: absolute;
  top: 10%;
  left: 8%;
  right: 6%;
  bottom: 8%;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 6px 20px rgb(0 0 0 / 0.1);
  display: flex;
}

.cover-xhs__notebook-rings {
  width: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8%;
  padding: 12% 0;
}

.cover-xhs__notebook-rings span {
  width: 14px;
  height: 14px;
  border: 3px solid #6ba3d9;
  border-radius: 50%;
  background: #fff;
}

.cover-xhs__notebook-inner {
  flex: 1;
  padding: 10% 8% 8%;
}

.cover-xhs__notebook-highlight {
  display: inline-block;
  background: linear-gradient(transparent 55%, #ffe566 55%);
  padding: 0 4px;
}

.cover-xhs__notebook-title {
  font-weight: 900;
  line-height: 1.15;
}

.cover-xhs__notebook-cta {
  display: inline-block;
  margin-top: 8%;
  padding: 6px 14px;
  border-radius: 999px;
  background: #4a9fd9;
  color: #fff !important;
  font-weight: 700;
}

.cover-xhs__notebook-lines {
  margin-top: 12%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.cover-xhs__hl {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  color: #1a1a1a;
}

.cover-xhs__hl--blue {
  background: linear-gradient(transparent 60%, #b5daf3 60%);
}

.cover-xhs__hl--yellow {
  background: linear-gradient(transparent 60%, #ffe566 60%);
}

.cover-xhs__notebook-arrow {
  width: 28px;
  height: 28px;
  border: 3px solid #e85d4c;
  border-color: #e85d4c transparent transparent #e85d4c;
  transform: rotate(45deg);
  margin-left: 4px;
}

/* ── 浏览器 CTA ── */
.cover-xhs--xhs-browser-cta {
  background-color: #3b8fd9;
  background-image: radial-gradient(circle, #fff 2px, transparent 2px);
  background-size: 16px 16px;
}

.cover-xhs__browser-window {
  position: absolute;
  top: 14%;
  left: 10%;
  right: 10%;
  bottom: 12%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.15);
  padding: 8% 8% 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cover-xhs__browser-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 12%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6%;
  border-bottom: 1px solid #e5e7eb;
}

.cover-xhs__megaphone {
  width: 22px;
  height: 18px;
  background: #f5d020;
  clip-path: polygon(0 30%, 70% 10%, 70% 90%, 0 70%);
  border-radius: 2px;
}

.cover-xhs__browser-dots span {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 4px;
  background: #d1d5db;
}

.cover-xhs__browser-dots span:nth-child(1) { background: #f87171; }
.cover-xhs__browser-dots span:nth-child(2) { background: #fbbf24; }
.cover-xhs__browser-dots span:nth-child(3) { background: #34d399; }

.cover-xhs__browser-title {
  font-weight: 900;
  line-height: 1.2;
  text-align: center;
  margin-top: 8%;
}

.cover-xhs__browser-btn {
  margin-top: 10%;
  padding: 10px 24px;
  border-radius: 999px;
  background: #5eb3e8;
  color: #fff !important;
  font-weight: 800;
  box-shadow: 0 4px 0 #3b8fd9;
}

.cover-xhs__browser-hand {
  position: absolute;
  bottom: 6%;
  right: 8%;
  width: 36px;
  height: 36px;
  background: #fcd9b0;
  border-radius: 50%;
  border: 2px solid #1a1a1a;
  box-shadow: 4px 4px 0 rgb(0 0 0 / 0.1);
}

/* ── 棕榈极简 ── */
.cover-xhs--xhs-palm-editorial {
  background: linear-gradient(165deg, #b8956c 0%, #d4b896 45%, #e8d4bc 100%);
}

.cover-xhs__palm-shadow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 20% 30%, rgb(0 0 0 / 0.18), transparent 60%),
    radial-gradient(ellipse 60% 40% at 85% 70%, rgb(0 0 0 / 0.14), transparent 55%),
    radial-gradient(ellipse 50% 35% at 70% 20%, rgb(0 0 0 / 0.1), transparent 50%);
  pointer-events: none;
}

.cover-xhs__palm-card {
  position: absolute;
  top: 22%;
  left: 12%;
  right: 12%;
  padding: 14% 10%;
  background: rgb(255 255 255 / 0.88);
  text-align: center;
}

.cover-xhs__palm-brand {
  font-size: 8px;
  letter-spacing: 0.2em;
  color: #a8a29e;
  margin-bottom: 12%;
}

.cover-xhs__palm-title {
  font-weight: 700;
  line-height: 1.25;
}

.cover-xhs__palm-sub {
  margin-top: 10%;
  font-size: inherit;
  opacity: 0.85;
}

/* ── 职场详情 ── */
.cover-xhs--xhs-detail-workplace {
  background: linear-gradient(180deg, #b8e4f5 0%, #e8f6fc 55%, #ffffff 100%);
}

.cover-xhs__work-head {
  position: absolute;
  top: 8%;
  left: 8%;
  right: 8%;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.cover-xhs__work-title {
  flex: 1;
  font-weight: 900;
  line-height: 1.15;
}

.cover-xhs__work-megaphone {
  flex-shrink: 0;
  width: 36px;
  height: 32px;
  background: #f5d020;
  clip-path: polygon(0 25%, 65% 5%, 65% 95%, 0 75%);
  border-radius: 2px;
  margin-top: 4px;
}

.cover-xhs__work-sub {
  position: absolute;
  top: 22%;
  left: 8%;
  font-weight: 600;
  opacity: 0.85;
}

.cover-xhs__work-list {
  position: absolute;
  top: 30%;
  left: 8%;
  right: 8%;
  bottom: 8%;
}

.cover-xhs__work-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10%;
  align-items: flex-start;
}

.cover-xhs__work-num {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #3b8fd9;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-xhs__work-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cover-xhs__work-bar {
  height: 6px;
  background: rgb(0 0 0 / 0.08);
  border-radius: 3px;
}

.cover-xhs__work-bar--title {
  height: 8px;
  width: 55%;
  background: rgb(0 0 0 / 0.2);
}

.cover-xhs__work-bar--short {
  width: 70%;
}

/* ── 自媒体详情 ── */
.cover-xhs--xhs-detail-media {
  background: linear-gradient(160deg, #c4b5fd 0%, #ddd6fe 40%, #ede9fe 75%, #f5f3ff 100%);
}

.cover-xhs__media-shape {
  position: absolute;
  border-radius: 30% 70% 60% 40% / 40% 50% 50% 60%;
  opacity: 0.5;
}

.cover-xhs__media-shape--1 {
  width: 80px;
  height: 80px;
  top: 4%;
  right: -10%;
  background: #a78bfa;
}

.cover-xhs__media-shape--2 {
  width: 60px;
  height: 60px;
  bottom: 8%;
  left: -8%;
  background: #c4b5fd;
}

.cover-xhs__media-title {
  position: absolute;
  top: 10%;
  left: 10%;
  right: 10%;
  font-weight: 900;
  line-height: 1.15;
  color: #1e3a5f;
}

.cover-xhs__media-star {
  color: #7c3aed;
  margin-left: 4px;
}

.cover-xhs__media-card {
  position: absolute;
  top: 28%;
  left: 8%;
  right: 8%;
  bottom: 8%;
  background: #fff;
  border-radius: 12px;
  padding: 8%;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.08);
}

.cover-xhs__media-row {
  display: flex;
  gap: 10px;
  margin-bottom: 8%;
  align-items: flex-start;
}

.cover-xhs__media-no {
  font-size: 12px;
  font-weight: 900;
  color: #7c3aed;
  flex-shrink: 0;
}

.cover-xhs__media-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.cover-xhs__media-bar {
  height: 5px;
  background: #e5e7eb;
  border-radius: 2px;
}

.cover-xhs__media-bar--title {
  height: 7px;
  width: 60%;
  background: #cbd5e1;
}

.cover-xhs__media-kw {
  margin-top: 4%;
  font-weight: 700;
  color: #4c1d95;
}

/* ── 孟菲斯详情 ── */
.cover-xhs--xhs-detail-memphis {
  background: #7cb87a;
  padding: 3%;
}

.cover-xhs__memphis-frame {
  position: absolute;
  inset: 3%;
  background: #faf7f2;
  border-radius: 4px;
  box-shadow: 0 4px 0 rgb(0 0 0 / 0.15);
  padding: 8%;
  overflow: hidden;
}

.cover-xhs__memphis-deco {
  position: absolute;
  top: 6%;
  right: 6%;
}

.cover-xhs__memphis-heart {
  display: block;
  width: 24px;
  height: 24px;
  background: #f472b6;
  transform: rotate(-12deg);
  clip-path: polygon(50% 0%, 100% 35%, 85% 100%, 50% 75%, 15% 100%, 0% 35%);
}

.cover-xhs__memphis-blob {
  position: absolute;
  top: -8px;
  right: 28px;
  width: 20px;
  height: 20px;
  background: #f5d020;
  border-radius: 50%;
}

.cover-xhs__memphis-title {
  font-weight: 900;
  line-height: 1.1;
  -webkit-text-stroke: 1px #1a1a1a;
  paint-order: stroke fill;
}

.cover-xhs__memphis-steps {
  margin-top: 10%;
}

.cover-xhs__memphis-step {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6%;
}

.cover-xhs__memphis-step-tag {
  flex-shrink: 0;
  padding: 4px 8px;
  background: #4ade80;
  color: #14532d;
  font-size: 10px;
  font-weight: 900;
  border: 2px solid #1a1a1a;
}

.cover-xhs__memphis-step-line {
  flex: 1;
  height: 6px;
  background: rgb(0 0 0 / 0.1);
  border-radius: 3px;
}

.cover-xhs__memphis-kw {
  margin-top: 6%;
  font-weight: 700;
}

/* ── 手账详情 ── */
.cover-xhs--xhs-detail-scrapbook {
  background: #a8dcc0;
  padding: 4%;
}

.cover-xhs__scrap-frame {
  position: absolute;
  inset: 4%;
}

.cover-xhs__scrap-grid {
  position: absolute;
  inset: 0;
  background-color: #fff;
  background-image:
    linear-gradient(rgb(0 0 0 / 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgb(0 0 0 / 0.06) 1px, transparent 1px);
  background-size: 14px 14px;
  padding: 8%;
  overflow: hidden;
}

.cover-xhs__scrap-title {
  font-weight: 900;
  line-height: 1.15;
  color: #166534;
}

.cover-xhs__scrap-sections {
  margin-top: 10%;
}

.cover-xhs__scrap-section {
  margin-bottom: 10%;
}

.cover-xhs__scrap-brush {
  display: block;
  width: 55%;
  height: 14px;
  background: #86efac;
  border-radius: 2px;
  margin-bottom: 6px;
  opacity: 0.9;
}

.cover-xhs__scrap-line {
  display: block;
  height: 5px;
  background: rgb(0 0 0 / 0.08);
  border-radius: 2px;
  margin-bottom: 5px;
}

.cover-xhs__scrap-line--short {
  width: 75%;
}

.cover-xhs__scrap-kw {
  margin-top: 6%;
  font-weight: 600;
  color: #166534;
}

.cover-xhs__scrap-star {
  position: absolute;
  color: #fbbf24;
  font-size: 16px;
}

.cover-xhs__scrap-star--1 {
  top: 12%;
  right: 10%;
}

.cover-xhs__scrap-star--2 {
  bottom: 18%;
  left: 8%;
  font-size: 12px;
}

/* ── 缩略图模式 ── */
.cover-xhs--mini .cover-xhs__spring-tag { font-size: 5px; }
.cover-xhs--mini .cover-xhs__notebook-rings span { width: 6px; height: 6px; border-width: 1px; }
.cover-xhs--mini .cover-xhs__hl { font-size: 6px; }
.cover-xhs--mini .cover-xhs__palm-brand { font-size: 4px; }
.cover-xhs--mini .cover-xhs__work-num { width: 12px; height: 12px; font-size: 7px; }
.cover-xhs--mini .cover-xhs__media-no { font-size: 7px; }
.cover-xhs--mini .cover-xhs__memphis-step-tag { font-size: 6px; padding: 2px 4px; }
</style>
