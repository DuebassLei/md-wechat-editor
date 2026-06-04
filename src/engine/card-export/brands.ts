function readEnvBrand(key: string): string | undefined {
  try {
    const v = import.meta.env?.[key] as string | undefined
    if (v?.trim()) return v.trim()
  } catch {
    /* Node smoke tests: no Vite env */
  }
  return undefined
}

export const DEFAULT_XHS_BRAND = readEnvBrand('VITE_XHS_BRAND') ?? '墨韵简排'

export const DEFAULT_WECHAT_TIETU_BRAND =
  readEnvBrand('VITE_WECHAT_TIETU_BRAND') ?? DEFAULT_XHS_BRAND
