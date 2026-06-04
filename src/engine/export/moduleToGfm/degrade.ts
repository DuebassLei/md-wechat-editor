import { parseMd2wechatModuleBody } from '@/lib/r-markdown/md2wechatModuleParser'
import { readFencedModule } from '@/lib/r-markdown/utils/fencedModule'
import { parseAttrs } from '@/lib/r-markdown/utils/helpers'
import { mapModuleToGfm } from './mappers'
import type { ConversionEntry } from '../types'

const MODULE_OPEN_RE = /^:::\s*([\w-]+)(?:\[(.+)\])?(?:\s+(.+))?\s*$/i
const MODULE_CLOSE_RE = /^:::\s*$/
const OPEN_ATTR_MODULES = new Set(['steps', 'timeline'])

export interface DegradeResult {
  markdown: string
  entries: ConversionEntry[]
}

function mergeOpenLineFields(
  name: string,
  line: string,
  label: string | undefined,
  openInline: string | undefined,
  body: ReturnType<typeof parseMd2wechatModuleBody>,
): void {
  if (OPEN_ATTR_MODULES.has(name.toLowerCase())) {
    const tail = line.replace(/^:::\s*[\w-]+(?:\[[^\]]*\])?\s*/i, '')
    Object.assign(body.fields, parseAttrs(tail))
  }
  if (label) body.fields.label = label
  if (openInline?.includes('|') && name.toLowerCase() === 'compare') {
    const [left, right] = openInline.split('|').map((s) => s.trim())
    if (left) body.fields['left-title'] = left
    if (right) body.fields['right-title'] = right
  } else if (openInline && name.toLowerCase() !== 'compare') {
    if (!body.fields.title) body.fields.title = openInline
  }
}

export function degradeModulesToGfm(markdown: string): DegradeResult {
  const lines = markdown.split('\n')
  const out: string[] = []
  const entries: ConversionEntry[] = []
  const gfmBuffer: string[] = []
  let i = 0

  function flushGfm() {
    if (gfmBuffer.length) {
      out.push(gfmBuffer.join('\n'))
      gfmBuffer.length = 0
    }
  }

  while (i < lines.length) {
    const line = lines[i]
    if (/^:::\s*[\w-]/.test(line)) {
      flushGfm()
      const ext = readFencedModule(lines, i)
      if (ext) {
        const body = parseMd2wechatModuleBody(ext.bodyLines)
        Object.assign(body.fields, ext.attrs)
        if (ext.attrs._body) body.fields._body = ext.attrs._body
        const { markdown: md, entry } = mapModuleToGfm(ext.name, undefined, undefined, body)
        out.push(md)
        entries.push(entry)
        i = ext.next
        continue
      }
      const openMatch = line.match(MODULE_OPEN_RE)
      if (openMatch) {
        const name = openMatch[1]
        const label = openMatch[2]?.trim()
        const openInline = openMatch[3]?.trim()
        let j = i + 1
        const bodyLines: string[] = []
        while (j < lines.length && !MODULE_CLOSE_RE.test(lines[j].trim())) {
          bodyLines.push(lines[j])
          j++
        }
        if (j < lines.length) j++
        const body = parseMd2wechatModuleBody(bodyLines)
        mergeOpenLineFields(name, line, label, openInline, body)
        const { markdown: md, entry } = mapModuleToGfm(name, label, openInline, body)
        out.push(md)
        entries.push(entry)
        i = j
        continue
      }
    }
    gfmBuffer.push(line)
    i++
  }
  flushGfm()
  return { markdown: out.join('\n\n').trim(), entries }
}
