import type { LayoutTier } from '@/constants/layoutModules'

export type ThemeTier = 'basic' | 'pro'

export interface UserEntitlements {
  themeTier: ThemeTier
  layoutTier: LayoutTier
}

export const GUEST_ENTITLEMENTS: UserEntitlements = {
  themeTier: 'pro',
  layoutTier: 'advanced',
}
