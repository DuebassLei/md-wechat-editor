/** 串行化 html-to-image 导出，避免并行操作同一 document 导致卡死 */
let chain: Promise<void> = Promise.resolve()

export function withDomExportLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn)
  chain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}
