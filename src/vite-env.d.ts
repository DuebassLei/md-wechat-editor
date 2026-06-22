/// <reference types="vite/client" />

declare module '*.css?raw' {
  const content: string
  export default content
}

import type { PickerPerfReport } from '@/observability/layoutModulePickerPerf'

interface Window {
  __pickerPerfReport?: () => PickerPerfReport
}
