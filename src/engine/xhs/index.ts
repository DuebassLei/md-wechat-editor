export { extractXhs } from './extractMeta'
export { buildCover } from './buildCover'
export { prepareReadingHtml } from './prepareReading'
export { sliceContentToDataUrls } from './sliceContent'
export { resolveAccentColors } from './resolveAccent'
export { errText, htmlToImageOptions, onImageErrorHandler, TRANSPARENT_PX } from './imageExport'
export {
  buildZipBlob,
  dataUrlToBytes,
  downloadBlob,
  xhsZipArchiveName,
} from './downloadZip'
export { ASPECTS, XHS, DEFAULT_XHS_BRAND } from './tokens'
export type { XhsMeta, XhsAspect, XhsAccentMode, XhsCard } from './types'
