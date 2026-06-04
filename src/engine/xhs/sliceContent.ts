import {
  sliceContentToDataUrls as sliceShared,
  type SliceContentOptions,
} from '@/engine/card-export/sliceContent'
import { XHS_SLICE_THEME } from './tokens'
import type { XhsAspect } from './types'

export type { SliceContentOptions } from '@/engine/card-export/sliceContent'

export interface XhsSliceContentOptions {
  contentHtml: string
  brand: string
  aspect: XhsAspect
  previewContentWidth: number
}

export async function sliceContentToDataUrls(opts: XhsSliceContentOptions): Promise<string[]> {
  const full: SliceContentOptions = { ...opts, theme: XHS_SLICE_THEME }
  const { dataUrls } = await sliceShared(full)
  return dataUrls
}
