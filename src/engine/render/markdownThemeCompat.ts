function applyRegexFallback(html: string): string {
  return html
    .replace(/<h1>([\s\S]*?)<\/h1>/g, '<h1><span class="prefix"></span><span class="content">$1</span><span class="suffix"></span></h1>')
    .replace(/<h2>([\s\S]*?)<\/h2>/g, '<h2><span class="prefix"></span><span class="content">$1</span><span class="suffix"></span></h2>')
    .replace(/<h3>([\s\S]*?)<\/h3>/g, '<h3><span class="prefix"></span><span class="content">$1</span><span class="suffix"></span></h3>')
    .replace(/<h4>([\s\S]*?)<\/h4>/g, '<h4><span class="prefix"></span><span class="content">$1</span><span class="suffix"></span></h4>')
    .replace(/<li>([\s\S]*?)<\/li>/g, '<li><section>$1</section></li>');
}

function isListElement(node: Node): boolean {
  return node instanceof Element && (node.tagName === 'UL' || node.tagName === 'OL');
}

function hasMeaningfulContent(el: HTMLElement): boolean {
  return el.childNodes.length > 0 && el.textContent?.trim() !== '';
}

export function applyHeadingThemeCompat(html: string): string {
  // 浏览器环境用 DOM 处理，避免复杂 markdown 结构被正则误伤
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return applyRegexFallback(html);
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div id="compat-root">${html}</div>`, 'text/html');
    const root = doc.getElementById('compat-root');
    if (!root) return html;

    // 1) 标题兼容：补齐 prefix/content/suffix
    root.querySelectorAll('h1, h2, h3, h4').forEach((heading) => {
      if (heading.querySelector(':scope > .content')) return;
      const contentText = heading.innerHTML;
      heading.innerHTML = `<span class="prefix"></span><span class="content">${contentText}</span><span class="suffix"></span>`;
    });

    // 2) 列表兼容：将 li 的文本块包裹为 section，适配 #nice li section 主题规则
    root.querySelectorAll('li').forEach((li) => {
      if (li.querySelector(':scope > section')) return;
      const section = doc.createElement('section');
      const originalChildren = Array.from(li.childNodes);
      for (const child of originalChildren) {
        if (isListElement(child)) break;
        section.appendChild(child);
      }
      if (hasMeaningfulContent(section)) {
        li.insertBefore(section, li.firstChild);
      }
    });

    return root.innerHTML;
  } catch {
    return applyRegexFallback(html);
  }
}
