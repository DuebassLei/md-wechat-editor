import type { ThemeColors } from '../themeColors'
import type { ParseMarkdownOptions } from '../parseOptions'
import { guardLayoutModule } from '../parseOptions'
import { parseCallout } from './components'
import { tryParseMd2wechatModule } from '../md2wechatModuleParser'
import { tryParseCompareFenced } from './fencedCompare'
import {
  collectPTitleLevel1,
  tryParseExtensionFencedModule,
} from './fencedModule'
import { tryParsePluginFencedModule } from '@/modules/pluginFenced'
import { flushGfmMarkdownBuffer } from '@/utils/gfmThemeWrapper'

export function parseMarkdown(md: string, t: ThemeColors, opts?: ParseMarkdownOptions): string {
  const lines = md.split('\n')
  let html = ''
  const gfmBuffer: string[] = []
  let i = 0

  function flushGfm(): void {
    html += flushGfmMarkdownBuffer(gfmBuffer)
  }

  const pTitleLevel1List = collectPTitleLevel1(lines)

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      gfmBuffer.push(line)
      i++
      continue
    }

    if (/^:::\s*[\w-]/.test(line)) {
      const compareRich = tryParseCompareFenced(lines, i, t, opts)
      if (compareRich) {
        flushGfm()
        html += compareRich.html
        i = compareRich.next
        continue
      }

      const ext = tryParseExtensionFencedModule(lines, i, t, pTitleLevel1List)
      if (ext) {
        flushGfm()
        const moduleId = lines[i].match(/^:::\s*([\w-]+)/i)?.[1]?.toLowerCase() ?? ''
        const locked = guardLayoutModule(moduleId, opts)
        html += locked ?? ext.html
        i = ext.next
        continue
      }

      const pluginFenced = tryParsePluginFencedModule(lines, i, t)
      if (pluginFenced) {
        flushGfm()
        const moduleId = lines[i].match(/^:::\s*([\w-]+)/i)?.[1]?.toLowerCase() ?? ''
        const locked = guardLayoutModule(moduleId, opts)
        html += locked ?? pluginFenced.html
        i = pluginFenced.next
        continue
      }

      const md2w = tryParseMd2wechatModule(lines, i, t, md, opts)
      if (md2w) {
        flushGfm()
        html += md2w.html
        i = md2w.next
        continue
      }
    }

    if (/^>\s*\[(TIP|NOTE|WARNING|CAUTION|IMPORTANT)\]/.test(line)) {
      flushGfm()
      const locked = guardLayoutModule('callout', opts)
      const r = parseCallout(lines, i, t)
      html += locked ?? r.html
      i = r.next
      continue
    }

    gfmBuffer.push(line)
    i++
  }

  flushGfm()
  return html
}
