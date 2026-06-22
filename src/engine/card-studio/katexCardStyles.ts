import katexCss from 'katex/dist/katex.min.css?raw'

/** KaTeX 样式（卡片截图依赖，否则表格内公式会把行高撑到上万像素） */
export function buildKatexStyleBlock(): string {
  return `<style>${katexCss}
.card-reading .katex{display:inline-block;max-width:100%;overflow:hidden;vertical-align:bottom;}
.card-reading .katex-display{margin:.6em 0;overflow:hidden;}
.card-reading table .katex{line-height:1.2;}
</style>`
}
