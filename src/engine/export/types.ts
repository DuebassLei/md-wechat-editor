export type PlatformTarget = 'juejin' | 'csdn'

export interface ConversionEntry {
  moduleId: string
  strategy: 'precise' | 'generic' | 'fallback'
}

export interface ConversionReport {
  entries: ConversionEntry[]
  warnings: string[]
  /** 相对路径或可疑图片 URL 数量 */
  localImageCount: number
}

export interface PlatformExportResult {
  markdown: string
  report: ConversionReport
}
