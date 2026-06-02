export interface MigrateLegacyResult {
  markdown: string
  changed: boolean
  skipped: string[]
}

function attrsToFields(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
}

function parseXmlAttrs(attrStr: string): Record<string, string> {
  const out: Record<string, string> = {}
  const re = /([\w-]+)\s*=\s*"([^"]*)"/g
  let m: RegExpExecArray | null
  while ((m = re.exec(attrStr)) !== null) {
    out[m[1]] = m[2]
  }
  return out
}

export function migrateLegacyLayoutSyntax(markdown: string): MigrateLegacyResult {
  const skipped: string[] = []
  let out = markdown
  let changed = false

  out = out.replace(/<lead([^>]*)>([\s\S]*?)<\/lead>/gi, (_, _a, body) => {
    changed = true
    return `:::lead\n${body.trim()}\n:::\n\n`
  })

  out = out.replace(/<statement([^>]*)>([\s\S]*?)<\/statement>/gi, (_, _a, body) => {
    changed = true
    return `:::statement\n${body.trim()}\n:::\n\n`
  })

  out = out.replace(/<engage([^>]*)\s*\/?>/gi, (match) => {
    changed = true
    const attrs = parseXmlAttrs(match)
    const lines = attrsToFields(attrs)
    return `:::engage\n${lines}\n:::\n\n`
  })

  out = out.replace(/<reading-path\s*\/?>\s*<\/reading-path>/gi, () => {
    changed = true
    return `:::reading-path\n:::\n\n`
  })

  out = out.replace(/<reading-path\s*\/?>/gi, () => {
    changed = true
    return `:::reading-path\n:::\n\n`
  })

  out = out.replace(
    /<p-title\b([^>]*)\s*(?:\/>|>([\s\S]*?)<\/p-title>)/gi,
    (match, attrStr, body) => {
      changed = true
      const attrs = parseXmlAttrs(attrStr || match)
      if (body?.trim() && !attrs.title) attrs.title = body.trim()
      return `:::p-title\n${attrsToFields(attrs)}\n:::\n\n`
    },
  )

  if (/<compare\b/i.test(out)) {
    skipped.push('compare')
  }
  if (/<steps\b/i.test(out)) {
    skipped.push('steps')
  }
  if (/<timeline\b/i.test(out)) {
    skipped.push('timeline')
  }

  return { markdown: out, changed, skipped }
}
