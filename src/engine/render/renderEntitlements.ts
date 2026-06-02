import type { LayoutTier } from '@/constants/layoutModules'
import { layoutHintLabel, layoutModuleById } from '@/constants/layoutModules'
import { normalizeThemeId, type ThemeId } from '@/types/theme'
import type { TemplateEntitlementMap } from '@/types/templateEntitlements'

export type RenderEntitlements = {
  themeTier: 'pro'
  layoutTier: LayoutTier
}

/** 墨韵简排：全部主题与模块开放 */
export const OPEN_RENDER_ENTITLEMENTS: RenderEntitlements = {
  themeTier: 'pro',
  layoutTier: 'advanced',
}

/** @deprecated 使用 OPEN_RENDER_ENTITLEMENTS */
export const RESTRICTIVE_RENDER_ENTITLEMENTS = OPEN_RENDER_ENTITLEMENTS

export function renderEntitlementsFrom(): RenderEntitlements {
  return OPEN_RENDER_ENTITLEMENTS
}

export function resolveThemeForEntitlements(
  themeId: ThemeId,
  _entitlements?: RenderEntitlements,
  _maps?: TemplateEntitlementMap | null,
): ThemeId {
  return normalizeThemeId(themeId)
}

export function isLayoutModuleAllowed(_moduleId: string): boolean {
  return true
}

export function renderLockedLayoutModuleHtml(): string {
  return ''
}

export function layoutHintLabelExport(moduleId: string): string {
  return layoutHintLabel(moduleId)
}

export { layoutModuleById }
