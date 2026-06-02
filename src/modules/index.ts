import { registerBuiltinModules } from './registry'
import { registerAiIndigoHeroPlugin } from './plugins/aiIndigoHero'

let initialized = false

export function ensureModuleRegistry(): void {
  if (initialized) return
  registerBuiltinModules()
  registerAiIndigoHeroPlugin()
  initialized = true
}

export * from './registry'
export * from './types'
export { registerEngagePlugin } from './plugins/engage'
export { registerAiIndigoHeroPlugin } from './plugins/aiIndigoHero'
