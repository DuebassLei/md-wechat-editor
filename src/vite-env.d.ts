/// <reference types="vite/client" />

import type { PickerPerfReport } from '@/observability/layoutModulePickerPerf'

interface Window {
  __pickerPerfReport?: () => PickerPerfReport
}
