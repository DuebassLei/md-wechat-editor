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
import { injectSyncAttrsOnRoot } from '@/utils/editorSyncAnchors'

function wrapModuleHtml(fragment: string, lineIndex0: number, opts?: ParseMarkdownOptions): string {
  if (!opts?.editorSyncAnchors) return fragment
  return injectSyncAttrsOnRoot(fragment, lineIndex0 + 1)
}

export function parseMarkdown(md: string, t: ThemeColors, opts?: ParseMarkdownOptions): string {
  const lines = md.split('\n')
  let html = ''
  const gfmBuffer: string[] = []
  let gfmStartLine = 1
  let i = 0

  function flushGfm(): void {
    html += flushGfmMarkdownBuffer(gfmBuffer, gfmStartLine, opts)
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
        html += wrapModuleHtml(compareRich.html, i, opts)
        i = compareRich.next
        continue
      }

      const ext = tryParseExtensionFencedModule(lines, i, t, pTitleLevel1List)
      if (ext) {
        flushGfm()
        const moduleId = lines[i].match(/^:::\s*([\w-]+)/i)?.[1]?.toLowerCase() ?? ''
        const locked = guardLayoutModule(moduleId, opts)
        html += wrapModuleHtml(locked ?? ext.html, i, opts)
        i = ext.next
        continue
      }

      const pluginFenced = tryParsePluginFencedModule(lines, i, t)
      if (pluginFenced) {
        flushGfm()
        const moduleId = lines[i].match(/^:::\s*([\w-]+)/i)?.[1]?.toLowerCase() ?? ''
        const locked = guardLayoutModule(moduleId, opts)
        html += wrapModuleHtml(locked ?? pluginFenced.html, i, opts)
        i = pluginFenced.next
        continue
      }

      const md2w = tryParseMd2wechatModule(lines, i, t, md, opts)
      if (md2w) {
        flushGfm()
        html += wrapModuleHtml(md2w.html, i, opts)
        i = md2w.next
        continue
      }
    }

    if (/^>\s*\[(TIP|NOTE|WARNING|CAUTION|IMPORTANT)\]/.test(line)) {
      flushGfm()
      const locked = guardLayoutModule('callout', opts)
      const r = parseCallout(lines, i, t)
      html += wrapModuleHtml(locked ?? r.html, i, opts)
      i = r.next
      continue
    }

    if (gfmBuffer.length === 0) gfmStartLine = i + 1
    gfmBuffer.push(line)
    i++
  }

  flushGfm()
  return html
}
