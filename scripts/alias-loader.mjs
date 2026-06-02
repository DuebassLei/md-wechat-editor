import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')

const ALIASES = [
  ['@/lib/r-markdown', 'src/engine/r-markdown'],
  ['@/themes', 'src/engine/themes'],
  ['@/constants', 'src/engine/constants'],
  ['@/utils', 'src/engine/render'],
  ['@/types/theme', 'src/types/theme.ts'],
  ['@/api/templateEntitlements', 'src/api/templateEntitlements.ts'],
  ['@/types/entitlements', 'src/types/entitlements.ts'],
  ['@/types/templateEntitlements', 'src/engine/types/templateEntitlements.ts'],
  ['@', 'src'],
]

function resolveAlias(specifier) {
  for (const [find, replacement] of ALIASES) {
    if (specifier === find) return path.join(root, replacement)
    if (specifier.startsWith(`${find}/`)) {
      return path.join(root, replacement, specifier.slice(find.length + 1))
    }
  }
  return null
}

function resolveFile(basePath) {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.mjs`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.js'),
  ]
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate
    }
  }
  return null
}

function resolveRelative(specifier, parentURL) {
  if (!specifier.startsWith('.')) return null
  const parentDir = path.dirname(fileURLToPath(parentURL))
  return resolveFile(path.resolve(parentDir, specifier))
}

export async function resolve(specifier, context, nextResolve) {
  const aliased = resolveAlias(specifier)
  if (aliased) {
    const file = resolveFile(aliased)
    if (file) {
      return nextResolve(pathToFileURL(file).href, context)
    }
  }

  const relativeFile = resolveRelative(specifier, context.parentURL)
  if (relativeFile) {
    return nextResolve(pathToFileURL(relativeFile).href, context)
  }

  return nextResolve(specifier, context)
}
