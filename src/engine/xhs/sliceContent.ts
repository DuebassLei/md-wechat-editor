import {
  sliceContentToDataUrls as sliceShared,
  type SliceContentOptions,
  type SlicePurpose,
} from '@/engine/card-export/sliceContent'

export type { SlicePurpose }
import { XHS_SLICE_THEME } from './tokens'
import type { XhsAspect } from './types'

export type { SliceContentOptions } from '@/engine/card-export/sliceContent'

export interface XhsSliceContentOptions {
  contentHtml: string
  brand: string
  aspect: XhsAspect
  previewContentWidth: number
  purpose?: SliceContentOptions['purpose']
  onPage?: SliceContentOptions['onPage']
  signal?: AbortSignal
}

export async function sliceContentToDataUrls(opts: XhsSliceContentOptions): Promise<string[]> {
  const full: SliceContentOptions = { ...opts, theme: XHS_SLICE_THEME }
  const { dataUrls } = await sliceShared(full)
  return dataUrls
}
