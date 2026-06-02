import { registerBuiltinModules } from './registry'

let initialized = false

export function ensureModuleRegistry(): void {
  if (initialized) return
  registerBuiltinModules()
  initialized = true
}

export * from './registry'
export * from './types'
