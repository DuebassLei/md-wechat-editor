import type { ThemeId } from '@/types/theme'
import type { TemplateEntitlementMap } from '@/types/templateEntitlements'

export function isLayoutModuleMemberOnly(_moduleId: string, _maps?: TemplateEntitlementMap | null): boolean {
  return false
}

export function isThemeMemberOnly(_themeId: ThemeId, _maps?: TemplateEntitlementMap | null): boolean {
  return false
}
