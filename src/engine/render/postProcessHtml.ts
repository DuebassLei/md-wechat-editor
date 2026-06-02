/**
 * HTML 后处理：将 marked 生成的标准 HTML 转换为微信公众号兼容结构。
 * 对齐 markdown-nice 的 markdown-it-li + markdown-it-span 插件行为：
 * - <li> 内容包裹 <section>（微信编辑器会剥离 <li> 上的样式）
 * - 标题文字包裹 <span class="prefix/content/suffix">（主题 CSS 依赖这些选择器）
 */

function wrapListItems(doc: Document): void {
  const lis = doc.querySelectorAll('li');
  lis.forEach((li) => {
    // 如果已经包裹过则跳过
    if (li.children.length === 1 && li.children[0]?.tagName === 'SECTION') return;

    const section = doc.createElement('section');
    // 将 li 的所有子节点移入 section
    while (li.firstChild) {
      section.appendChild(li.firstChild);
    }
    li.appendChild(section);
  });
}

function wrapHeadingContent(doc: Document): void {
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((h) => {
    // 如果已经包裹过则跳过
    if (h.querySelector('.content')) return;

    // 收集所有子节点
    const children = Array.from(h.childNodes);
    if (children.length === 0) return;

    const prefix = doc.createElement('span');
    prefix.className = 'prefix';

    const content = doc.createElement('span');
    content.className = 'content';
    children.forEach((child) => content.appendChild(child));

    const suffix = doc.createElement('span');
    suffix.className = 'suffix';

    h.appendChild(prefix);
    h.appendChild(content);
    h.appendChild(suffix);
  });
}

function addDataTool(doc: Document): void {
  const nice = doc.querySelector('#nice');
  if (!nice) return;
  for (const child of nice.children) {
    child.setAttribute('data-tool', 'mdnice编辑器');
  }
}

/**
 * 对 marked 渲染后的 HTML 做微信适配的 DOM 结构变换。
 * 输入：marked.parse() 输出的标准 HTML
 * 输出：包裹在 <section id="nice"> 中的微信兼容 HTML
 */
export function postProcessForWechat(html: string): string {
  if (typeof DOMParser === 'undefined') return html;

  try {
    const doc = new DOMParser().parseFromString(
      `<section id="nice">${html}</section>`,
      'text/html',
    );

    wrapListItems(doc);
    wrapHeadingContent(doc);
    addDataTool(doc);

    const nice = doc.querySelector('#nice');
    return nice ? nice.outerHTML : `<section id="nice">${html}</section>`;
  } catch {
    return `<section id="nice">${html}</section>`;
  }
}
