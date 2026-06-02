import { renderLayoutModulePreviewHtml } from '@/composables/layoutModulePreview'

let chain: Promise<unknown> = Promise.resolve()

/** 串行调度模块 live 预览，避免打开弹层时并行解析尖峰 */
export function scheduleModulePreview(moduleId: string): Promise<string> {
  const run = () => renderLayoutModulePreviewHtml(moduleId)
  const task = chain.then(run, run)
  chain = task.then(
    () => undefined,
    () => undefined,
  )
  return task
}

export function resetPreviewScheduler(): void {
  chain = Promise.resolve()
}
