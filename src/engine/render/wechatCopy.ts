import { WECHAT_BASE_CSS } from './wechatBaseCss';
import { postProcessForWechat } from './postProcessHtml';
import { applyDraftWechatDecor } from '@/engine/themes/markdownThemes/drafts/applyDraftWechatDecor';
import { DRAFT_WECHAT_DECOR } from '@/engine/themes/markdownThemes/drafts/wechatDecor';

/**
 * 将主题 CSS 内联到 Markdown 生成的 HTML 中，产出微信公众号兼容的富文本。
 */

/** 微信编辑器会吞掉纯黑色，用偏一点的黑绕过 */
function fixWechatBlackColor(html: string): string {
  return html
    .replace(/color:\s*rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)/gi, 'color: rgb(1, 1, 1)')
    .replace(/color:\s*#000\b/gi, 'color: #010101')
    .replace(/color:\s*#000000\b/gi, 'color: #010101');
}

type JuiceApi = {
  inlineContent: (html: string, css: string, options?: object) => string
}

let juiceApi: JuiceApi | null = null
let juiceLoading: Promise<JuiceApi> | null = null

async function loadJuiceInline(): Promise<JuiceApi> {
  if (juiceApi) return juiceApi
  juiceLoading ??= import('juice').then((mod) => {
    const api = (mod as { default: JuiceApi }).default
    juiceApi = api
    return api
  })
  return juiceLoading
}

/** 预加载 juice（复制前可调用） */
export function preloadJuice(): void {
  void loadJuiceInline()
}

/**
 * 构建公众号可粘贴的 HTML 富文本
 * @param markdownHtml marked 渲染后的标准 HTML 片段（不含 #nice 容器）
 * @param themeCss 主题 CSS 字符串（使用 #nice 选择器）
 * @param themeId 可选；草案主题会注入微信兼容 DOM 装饰
 */
export async function buildWechatHtml(
  markdownHtml: string,
  themeCss: string,
  themeId?: string,
): Promise<string> {
  let processedHtml = postProcessForWechat(markdownHtml);
  const decor = themeId ? DRAFT_WECHAT_DECOR[themeId] : undefined;
  if (decor) {
    processedHtml = applyDraftWechatDecor(processedHtml, decor);
  }
  const mergedCss = WECHAT_BASE_CSS + '\n' + themeCss;

  let result: string;
  try {
    const inline = await loadJuiceInline();
    result = inline.inlineContent(processedHtml, mergedCss, {
      inlinePseudoElements: true,
      preserveImportant: true,
    });
  } catch {
    result = processedHtml.replace(
      '</section>',
      `<style>${mergedCss}</style></section>`,
    );
  }

  return fixWechatBlackColor(result);
}

function copyRichTextLegacy(html: string): boolean {
  const sel = window.getSelection();
  const range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;

  const input = document.createElement('input');
  input.style.position = 'absolute';
  input.style.left = '-9999px';
  input.style.top = '-9999px';
  document.body.appendChild(input);
  input.focus();
  input.setSelectionRange(0, 1);

  let success = false;
  const handler = (e: ClipboardEvent) => {
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.setData('text/html', html);
      e.clipboardData.setData('text/plain', html);
      success = true;
    }
    document.removeEventListener('copy', handler);
  };

  document.addEventListener('copy', handler);
  try {
    document.execCommand('copy');
  } catch {
    /* ignore */
  }
  document.removeEventListener('copy', handler);
  document.body.removeChild(input);

  if (range && sel) {
    sel.removeAllRanges();
    sel.addRange(range);
  }

  return success;
}

/**
 * 复制 HTML 富文本到系统剪贴板（同时写入 text/html 和 text/plain）
 */
export async function copyRichText(html: string): Promise<boolean> {
  if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([html], { type: 'text/plain' }),
        }),
      ]);
      return true;
    } catch {
      /* fall through to legacy path */
    }
  }

  return copyRichTextLegacy(html);
}

/**
 * 一键操作：将 markdown HTML + 主题 CSS → 内联后复制到剪贴板
 * @deprecated 优先使用 buildWechatArticleHtml + copyRichText
 */
export async function copyMarkdownToWechat(
  markdownHtml: string,
  themeCss: string,
  onSuccess?: () => void,
  onError?: (err: Error) => void,
): Promise<void> {
  try {
    const wechatHtml = await buildWechatHtml(markdownHtml, themeCss);
    const ok = await copyRichText(wechatHtml);
    if (ok) {
      onSuccess?.();
    } else {
      onError?.(new Error('复制失败：浏览器不支持此操作'));
    }
  } catch (e) {
    onError?.(e instanceof Error ? e : new Error(String(e)));
  }
}
