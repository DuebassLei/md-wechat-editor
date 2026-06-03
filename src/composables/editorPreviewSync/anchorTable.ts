export type SyncAnchor = { line: number; el: Element; top: number }

function topInScrollRoot(el: HTMLElement, scrollRoot: HTMLElement): number {
  return el.getBoundingClientRect().top - scrollRoot.getBoundingClientRect().top + scrollRoot.scrollTop
}

export function buildAnchorTable(scrollRoot: HTMLElement): SyncAnchor[] {
  const nodes = scrollRoot.querySelectorAll('[data-md-sync="block"][data-md-line-start]')
  const anchors: SyncAnchor[] = []
  nodes.forEach((el) => {
    const htmlEl = el as HTMLElement
    const line = Number(htmlEl.dataset.mdLineStart)
    if (!Number.isFinite(line)) return
    anchors.push({ line, el, top: topInScrollRoot(htmlEl, scrollRoot) })
  })
  anchors.sort((a, b) => a.line - b.line)
  return anchors
}

export function lineToAnchor(anchors: SyncAnchor[], line: number): SyncAnchor | null {
  if (!anchors.length) return null
  let best = anchors[0]
  for (const a of anchors) {
    if (a.line <= line) best = a
    else break
  }
  return best
}

export function anchorAtPreviewCenter(
  anchors: SyncAnchor[],
  scrollRoot: HTMLElement,
): SyncAnchor | null {
  if (!anchors.length) return null
  const centerY = scrollRoot.scrollTop + scrollRoot.clientHeight / 2
  let best = anchors[0]
  let bestDist = Infinity
  for (const a of anchors) {
    const el = a.el as HTMLElement
    const mid = a.top + el.offsetHeight / 2
    const dist = Math.abs(mid - centerY)
    if (dist < bestDist) {
      bestDist = dist
      best = a
    }
  }
  return best
}

export function scrollPreviewToAnchor(scrollRoot: HTMLElement, anchor: SyncAnchor): void {
  const el = anchor.el as HTMLElement
  const target = anchor.top + el.offsetHeight / 2 - scrollRoot.clientHeight / 2
  scrollRoot.scrollTop = Math.max(0, target)
}
