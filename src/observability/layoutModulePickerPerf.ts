export type PickerPerfReport = {
  openMs: number | null
  firstPaintMs: number | null
  interactiveMs: number | null
  firstThumbMs: number | null
  scrollFps: number | null
}

const ENABLED =
  import.meta.env.DEV || localStorage.getItem('mdwe:picker-perf') === '1'

let openStart = 0
const report: PickerPerfReport = {
  openMs: null,
  firstPaintMs: null,
  interactiveMs: null,
  firstThumbMs: null,
  scrollFps: null,
}

export function isPickerPerfEnabled(): boolean {
  return ENABLED
}

export function resetPickerPerf(): void {
  report.openMs = null
  report.firstPaintMs = null
  report.interactiveMs = null
  report.firstThumbMs = null
  report.scrollFps = null
  openStart = 0
}

export function markPickerOpenStart(): void {
  if (!ENABLED) return
  resetPickerPerf()
  openStart = performance.now()
  performance.mark('picker.open.start')
}

export function markPickerFirstPaint(): void {
  if (!ENABLED || report.firstPaintMs != null) return
  report.firstPaintMs = performance.now() - openStart
  performance.mark('picker.first-paint')
}

export function markPickerInteractive(): void {
  if (!ENABLED || report.interactiveMs != null) return
  report.interactiveMs = performance.now() - openStart
  report.openMs = report.interactiveMs
  performance.mark('picker.interactive')
  try {
    performance.measure('picker.open', 'picker.open.start', 'picker.interactive')
  } catch {
    /* duplicate measure */
  }
}

export function markPickerFirstThumb(): void {
  if (!ENABLED || report.firstThumbMs != null) return
  report.firstThumbMs = performance.now() - openStart
  performance.mark('picker.first-thumb')
}

export function startPickerScrollFpsSample(scrollEl: HTMLElement): void {
  if (!ENABLED) return

  const sample = () => {
    let frames = 0
    const start = performance.now()
    const durationMs = 2000

    const tick = (now: number) => {
      frames++
      if (now - start < durationMs) {
        requestAnimationFrame(tick)
        return
      }
      report.scrollFps = Math.round((frames * 1000) / (now - start))
    }
    requestAnimationFrame(tick)
  }

  scrollEl.addEventListener('pointerdown', sample, { once: true })
}

export function getPickerPerfReport(): PickerPerfReport {
  return { ...report }
}

export function installPickerPerfGlobal(): void {
  if (!ENABLED) return
  ;(
    window as Window & { __pickerPerfReport?: () => PickerPerfReport }
  ).__pickerPerfReport = getPickerPerfReport
}
