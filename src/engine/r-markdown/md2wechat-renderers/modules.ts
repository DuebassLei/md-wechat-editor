import type { ThemeColors } from '../themeColors'
import { esc, leaf } from '../utils/helpers'
import { Title_DA02 } from '../editor-components/Title_DA02'
import { Statement_DA01 } from '../editor-components/Statement_DA01'
import { Lead_DA01 } from '../editor-components/Lead_DA01'
import { Timeline_DA02 } from '../editor-components/Timeline_DA02'
import { Steps_DA01 } from '../editor-components/Steps_DA01'
import { Compare_DA01 } from '../editor-components/Compare_DA01'
import type { Md2wechatModuleBody } from './shared'
import {
  bodyText,
  cardFrame,
  chipRow,
  eyebrow,
  highlightBars,
  hTitle,
  parseJsonContent,
  rowCells,
  sectionWrap,
  splitFeatures,
  splitTags,
} from './shared'

type RenderFn = (body: Md2wechatModuleBody, t: ThemeColors, fullMd: string) => string

function renderMetrics(body: Md2wechatModuleBody, t: ThemeColors): string {
  let inner = body.label ? hTitle(body.label, '16px') : ''
  inner += `<section style="display:flex;flex-direction:column;gap:10px">`
  body.rows.forEach((row) => {
    const { cells, accent } = rowCells(row)
    const [label, value, suffix] = cells
    if (!label) return
    inner += `<section style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-radius:12px;background:${accent ? `${t.accent}10` : 'rgb(255,255,255)'};border:1px solid ${accent ? t.accent : 'rgb(229,231,235)'}">`
    inner += `<section style="flex:1;min-width:0">`
    inner += `<p style="margin:0 0 4px;font-size:12px;color:rgb(100,116,139);font-weight:600">${leaf(label)}</p>`
    if (value) {
      inner += `<p style="margin:0;font-size:26px;font-weight:900;color:${accent ? t.accent : 'rgb(17,24,39)'};line-height:1.1">${leaf(value)}</p>`
    }
    if (suffix) inner += `<p style="margin:6px 0 0;font-size:13px;color:rgb(71,85,105);line-height:1.6">${leaf(suffix)}</p>`
    inner += `</section></section>`
  })
  inner += `</section>`
  return cardFrame(t, inner)
}

function renderCards(body: Md2wechatModuleBody, t: ThemeColors): string {
  let inner = body.label ? hTitle(body.label, '16px') : ''
  inner += `<section style="display:flex;flex-direction:column;gap:10px">`
  body.rows.forEach((row) => {
    const { cells, accent } = rowCells(row)
    const [label, title, desc] = cells
    if (!title) return
    inner += `<section style="padding:14px 16px;border-radius:12px;border:1px solid ${accent ? t.accent : 'rgb(229,231,235)'};background:${accent ? `${t.accent}08` : 'rgb(255,255,255)'}">`
    if (label) inner += `<p style="margin:0 0 6px;font-size:10px;font-weight:800;color:${t.accent};letter-spacing:1.8px">${leaf(label)}</p>`
    inner += `<p style="margin:0 0 4px;font-size:16px;font-weight:800;color:rgb(17,24,39)">${leaf(title)}</p>`
    if (desc) inner += bodyText(desc, t)
    inner += `</section>`
  })
  inner += `</section>`
  return cardFrame(t, inner)
}

function renderPricing(body: Md2wechatModuleBody, t: ThemeColors): string {
  let inner = body.label ? hTitle(body.label, '16px') : ''
  inner += `<section style="display:flex;flex-direction:column;gap:12px">`
  body.rows.forEach((row) => {
    const { cells, accent } = rowCells(row)
    const [plan, price, featuresRaw] = cells
    if (!plan) return
    const features = featuresRaw ? splitFeatures(featuresRaw) : []
    inner += `<section style="padding:16px;border-radius:14px;border:2px solid ${accent ? t.accent : 'rgb(229,231,235)'};background:${accent ? `${t.accent}06` : 'rgb(255,255,255)'}">`
    inner += `<section style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:10px">`
    inner += `<p style="margin:0;font-size:16px;font-weight:800;color:rgb(17,24,39)">${leaf(plan)}</p>`
    if (price) inner += `<p style="margin:0;font-size:22px;font-weight:900;color:${accent ? t.accent : 'rgb(17,24,39)'}">${leaf(price)}</p>`
    inner += `</section>`
    if (features.length) {
      inner += `<ul style="margin:0;padding:0;list-style:none">`
      features.forEach((f) => {
        inner += `<li style="margin:0 0 6px;padding-left:16px;position:relative;font-size:13px;color:rgb(71,85,105)"><span style="position:absolute;left:0;color:${t.accent}">•</span>${leaf(f)}</li>`
      })
      inner += `</ul>`
    }
    inner += `</section>`
  })
  inner += `</section>`
  return cardFrame(t, inner)
}

function renderToc(body: Md2wechatModuleBody, t: ThemeColors): string {
  let inner = eyebrow(body.label || '阅读导航', t)
  inner += `<section style="display:flex;flex-direction:column;gap:0;border-radius:12px;overflow:hidden;border:1px solid rgb(229,231,235)">`
  body.rows.forEach((row, idx) => {
    const [num, title, desc] = row
    if (!title) return
    inner += `<section style="display:flex;gap:12px;padding:12px 14px;background:${idx % 2 ? 'rgb(248,250,252)' : 'rgb(255,255,255)'};border-top:${idx ? '1px solid rgb(241,245,249)' : 'none'}">`
    if (num) {
      inner += `<span style="flex-shrink:0;width:32px;height:32px;line-height:32px;text-align:center;border-radius:8px;background:${t.accent};color:#fff;font-size:11px;font-weight:900">${leaf(num)}</span>`
    }
    inner += `<section style="flex:1"><p style="margin:0 0 2px;font-size:14px;font-weight:700;color:rgb(17,24,39)">${leaf(title)}</p>`
    if (desc) inner += `<p style="margin:0;font-size:12px;color:rgb(100,116,139)">${leaf(desc)}</p>`
    inner += `</section></section>`
  })
  inner += `</section>`
  return sectionWrap(inner)
}

function renderVerdictFamily(name: string, body: Md2wechatModuleBody, t: ThemeColors): string {
  const { fields, label } = body
  let inner = eyebrow(fields.eyebrow || label || (name === 'verdict' ? '最终判断' : name === 'manifesto' ? '宣言' : '过渡'), t)
  if (fields.title) inner += hTitle(fields.title, name === 'manifesto' ? '20px' : '18px')
  const content = fields.body || fields.text || fields.content
  if (content) inner += bodyText(content, t)
  if (fields.note || fields.meta) {
    inner += `<p style="margin:12px 0 0;font-size:11px;color:rgb(148,163,184)">${leaf([fields.note, fields.meta].filter(Boolean).join(' · '))}</p>`
  }
  return cardFrame(t, inner, { accent: name === 'verdict' || name === 'manifesto' })
}

function renderAudienceFit(body: Md2wechatModuleBody, t: ThemeColors): string {
  const { fields } = body
  let inner = ''
  if (fields.title) inner += hTitle(fields.title)
  if (fields.subtitle) inner += bodyText(fields.subtitle, t)
  if (fields.fit) {
    inner += `<p style="margin:14px 0 6px;font-size:12px;font-weight:700;color:rgb(5,150,105)">适合</p>`
    inner += chipRow(splitTags(fields.fit), t, 'fit')
  }
  if (fields.avoid) {
    inner += `<p style="margin:14px 0 6px;font-size:12px;font-weight:700;color:rgb(185,28,28)">不适合</p>`
    inner += chipRow(splitTags(fields.avoid), t, 'avoid')
  }
  if (fields.note) inner += `<p style="margin:12px 0 0;font-size:12px;color:rgb(148,163,184)">${leaf(fields.note)}</p>`
  return cardFrame(t, inner)
}

function renderInfographic(body: Md2wechatModuleBody, t: ThemeColors): string {
  const { fields } = body
  const type = (fields.type || 'statement').toLowerCase()
  let inner = ''
  if (fields.eyebrow) inner += eyebrow(fields.eyebrow, t)
  if (fields.title) {
    inner += `<p style="margin:0 0 8px;font-size:22px;font-weight:900;color:rgb(17,24,39);line-height:1.35;text-align:center">${highlightBars(fields.title, t)}</p>`
  }
  if (fields.subtitle) inner += `<p style="margin:0 0 14px;font-size:13px;color:rgb(100,116,139);text-align:center">${leaf(fields.subtitle)}</p>`
  if (type === 'data' && fields.value) {
    inner += `<section style="text-align:center;padding:16px 0">`
    if (fields.label) inner += `<p style="margin:0 0 4px;font-size:12px;color:rgb(100,116,139)">${leaf(fields.label)}</p>`
    inner += `<p style="margin:0;font-size:40px;font-weight:900;color:${t.accent}">${leaf(fields.value)}</p></section>`
  } else if (type === 'flow' && fields.flow) {
    const steps = splitTags(fields.flow)
    inner += `<section style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px">`
    steps.forEach((step, i) => {
      inner += `<span style="padding:8px 12px;border-radius:999px;background:${t.accent}12;color:${t.accent};font-size:12px;font-weight:700">${leaf(step)}</span>`
      if (i < steps.length - 1) inner += `<span style="color:rgb(203,213,225)">→</span>`
    })
    inner += `</section>`
  } else if (type === 'contrast' && fields.left && fields.right) {
    ;[
      ['左', fields.left, 'rgb(254,242,242)', 'rgb(239,68,68)'],
      ['右', fields.right, 'rgb(236,253,245)', 'rgb(16,185,129)'],
    ].forEach(([tag, text, bg, border]) => {
      inner += `<section style="margin:0 0 8px;padding:12px;border-radius:10px;background:${bg};border-left:3px solid ${border}">`
      inner += `<p style="margin:0 0 4px;font-size:10px;font-weight:800;color:${border}">${leaf(String(tag))}</p>`
      inner += `<p style="margin:0;font-size:14px;color:rgb(51,65,85)">${leaf(String(text))}</p></section>`
    })
  } else if (fields.quote) {
    inner += `<blockquote style="margin:12px 0 0;padding:12px 16px;border-left:3px solid ${t.accent};background:rgb(248,250,252);font-style:italic">${leaf(fields.quote)}</blockquote>`
  }
  if (fields.note) inner += `<p style="margin:12px 0 0;font-size:11px;color:rgb(148,163,184);text-align:center">${leaf(fields.note)}</p>`
  return cardFrame(t, inner, { accent: fields.accent === 'true', padding: '24px 18px' })
}

function renderQuote(body: Md2wechatModuleBody, t: ThemeColors): string {
  const { fields } = body
  const text = fields.quote || fields.text || ''
  const accent = fields.tone === 'accent'
  let inner = fields.eyebrow ? eyebrow(fields.eyebrow, t) : ''
  inner += `<p style="margin:0;font-size:${accent ? '18px' : '16px'};font-weight:${accent ? '800' : '600'};color:rgb(17,24,39);line-height:1.65;font-style:italic">"${leaf(text)}"</p>`
  if (fields.source) inner += `<p style="margin:10px 0 0;font-size:12px;color:rgb(100,116,139)">— ${leaf(fields.source)}</p>`
  return cardFrame(t, inner, { accent })
}

function renderImageText(body: Md2wechatModuleBody, t: ThemeColors): string {
  const { fields } = body
  const imageRight = fields.layout === 'right'
  const img = fields.image ? `<img src="${esc(fields.image)}" alt="${esc(fields.alt || '')}" style="display:block;width:100%;border-radius:10px" />` : ''
  let text = ''
  if (fields.eyebrow) text += eyebrow(fields.eyebrow, t)
  if (fields.title) text += hTitle(fields.title, '16px')
  if (fields.body) text += bodyText(fields.body, t)
  let inner = imageRight ? `${text}${img}` : `${img}${text}`
  return cardFrame(t, `<section style="display:flex;flex-direction:column;gap:14px">${inner}</section>`)
}

function renderAuthorCard(body: Md2wechatModuleBody, t: ThemeColors): string {
  const { fields } = body
  let inner = `<section style="display:flex;gap:14px">`
  if (fields.avatar) {
    inner += `<img src="${esc(fields.avatar)}" alt="" style="width:56px;height:56px;border-radius:14px;object-fit:cover" />`
  } else {
    inner += `<span style="width:56px;height:56px;border-radius:14px;background:${t.accent};color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900">${leaf((fields.name || '?').slice(0, 1))}</span>`
  }
  inner += `<section style="flex:1">`
  if (fields.name) inner += `<p style="margin:0 0 2px;font-size:16px;font-weight:800">${leaf(fields.name)}</p>`
  if (fields.role) inner += `<p style="margin:0 0 8px;font-size:12px;color:${t.accent};font-weight:600">${leaf(fields.role)}</p>`
  if (fields.bio) inner += bodyText(fields.bio, t)
  if (fields.tags) inner += chipRow(splitTags(fields.tags).slice(0, 4), t)
  inner += `</section></section>`
  if (fields.note) inner += `<p style="margin:12px 0 0;font-size:13px;color:rgb(71,85,105)">${leaf(fields.note)}</p>`
  if (fields.link) inner += `<p style="margin:6px 0 0;font-size:12px;color:${t.accent};font-weight:600">${leaf(fields.link)}</p>`
  return cardFrame(t, inner)
}

function renderSubscribe(body: Md2wechatModuleBody, t: ThemeColors): string {
  const { fields } = body
  const title = fields.title || fields.cta || ''
  let inner = fields.label ? eyebrow(fields.label, t) : ''
  if (title) inner += hTitle(title, '17px')
  if (fields.subtitle || fields.description) inner += bodyText(fields.subtitle || fields.description || '', t)
  inner += `<section style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px">`
  inner += `<span style="flex:1;min-width:120px;text-align:center;padding:11px 16px;border-radius:10px;background:${t.accent};color:#fff;font-size:13px;font-weight:700">${leaf(fields.primary || '继续关注')}</span>`
  inner += `<span style="flex:1;min-width:120px;text-align:center;padding:11px 16px;border-radius:10px;background:#fff;color:${t.accent};border:1px solid ${t.accent};font-size:13px;font-weight:700">${leaf(fields.secondary || '收藏这篇')}</span>`
  inner += `</section>`
  if (fields.note) inner += `<p style="margin:12px 0 0;font-size:11px;color:rgb(148,163,184);text-align:center">${leaf(fields.note)}</p>`
  return cardFrame(t, inner, { accent: true })
}

function renderCtaFields(body: Md2wechatModuleBody, t: ThemeColors): string {
  const { fields } = body
  const title = fields.title || fields.action || ''
  let inner = `<section style="text-align:center">`
  if (title) inner += `<p style="margin:0 0 18px;font-size:18px;font-weight:800;color:#fff;line-height:1.5">${leaf(title)}</p>`
  inner += `<section style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px">`
  ;['收藏', '转发', '在看'].forEach((btn) => {
    inner += `<span style="padding:10px 18px;border-radius:999px;background:rgba(255,255,255,0.18);color:#fff;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,0.25)">${btn}</span>`
  })
  inner += `</section>`
  if (fields.note) inner += `<p style="margin:14px 0 0;font-size:10px;letter-spacing:2px;font-weight:700;color:rgba(255,255,255,0.7)">${leaf(fields.note)}</p>`
  inner += `</section>`
  return `<section style="margin:24px 0;padding:28px 20px;background:linear-gradient(135deg,${t.accent},${t.dark});border-radius:16px">${inner}</section>`
}

function renderSummary(body: Md2wechatModuleBody, t: ThemeColors): string {
  const { fields } = body
  const highlight = fields.highlight || fields.title || ''
  let inner = eyebrow(fields.eyebrow || '一句话总结', t)
  if (highlight) inner += `<p style="margin:0 0 10px;font-size:20px;font-weight:900;color:${t.accent}">${leaf(highlight)}</p>`
  if (fields.body || fields.content) inner += bodyText(fields.body || fields.content || '', t)
  if (fields.points) {
    inner += `<ul style="margin:10px 0 0;padding-left:18px;font-size:14px;color:rgb(71,85,105)">`
    splitTags(fields.points).forEach((p) => { inner += `<li style="margin:4px 0">${leaf(p)}</li>` })
    inner += `</ul>`
  }
  return cardFrame(t, inner, { accent: true })
}

function renderFaq(body: Md2wechatModuleBody, t: ThemeColors): string {
  let inner = body.label ? hTitle(body.label, '16px') : ''
  body.rows.forEach(([q, a]) => {
    if (!q) return
    inner += `<section style="margin:0 0 10px;padding:12px;border-radius:10px;background:#fff;border:1px solid rgb(229,231,235)">`
    inner += `<p style="margin:0 0 6px;font-size:14px;font-weight:700">${leaf(q)}</p>`
    if (a) inner += bodyText(a, t)
    inner += `</section>`
  })
  return cardFrame(t, inner)
}

function renderChecklist(body: Md2wechatModuleBody, t: ThemeColors): string {
  let inner = body.label ? hTitle(body.label, '16px') : ''
  inner += `<ul style="margin:0;padding:0;list-style:none">`
  body.rows.forEach((row) => {
    inner += `<li style="margin:0 0 8px;padding:10px 12px 10px 32px;position:relative;border-radius:10px;background:#fff;border:1px solid rgb(229,231,235)">`
    inner += `<span style="position:absolute;left:12px;color:${t.accent};font-weight:900">✓</span>${leaf(row.join(' — '))}</li>`
  })
  inner += `</ul>`
  return cardFrame(t, inner)
}

/** md2wechat 行式 VS 对比：:::compare 左标题 | 右标题 + 管道行 */
function renderCompareVs(body: Md2wechatModuleBody, t: ThemeColors): string {
  const leftHeader = body.fields['left-title'] || body.fields.left || ''
  const rightHeader = body.fields['right-title'] || body.fields.right || ''
  let inner = body.label ? hTitle(body.label, '16px') : ''

  body.rows.forEach((row, idx) => {
    const cells = row.map((c) => c.trim()).filter(Boolean)
    if (!cells.length) return

    let leftMain = ''
    let leftSub = ''
    let rightMain = ''
    let rightSub = ''

    if (cells.length >= 4) {
      ;[leftMain, leftSub, rightMain, rightSub] = cells
    } else if (cells.length === 3) {
      ;[leftMain, rightMain, rightSub] = cells
    } else {
      ;[leftMain, rightMain] = cells
    }
    if (!leftMain && !rightMain) return

    const showHeaders = idx === 0 && (leftHeader || rightHeader)

    const renderCardCell = (
      header: string,
      main: string,
      sub: string,
      variant: 'left' | 'right',
    ): string => {
      const isRight = variant === 'right'
      const bg = isRight ? `${t.accent}10` : 'rgb(248,250,252)'
      const border = isRight ? `${t.accent}55` : 'rgb(229,231,235)'
      const headerColor = isRight ? t.accent : 'rgb(100,116,139)'
      let cell = `<td style="width:42%;vertical-align:top;padding:14px 12px;border-radius:12px;background:${bg};border:1px solid ${border}">`
      if (showHeaders && header) {
        cell += `<p style="margin:0 0 8px;font-size:10px;font-weight:800;color:${headerColor};letter-spacing:1.5px;text-transform:uppercase">${leaf(header)}</p>`
      }
      if (main) {
        cell += `<p style="margin:0;font-size:15px;font-weight:800;color:rgb(17,24,39);line-height:1.45">${leaf(main)}</p>`
      }
      if (sub) {
        cell += `<p style="margin:6px 0 0;font-size:12px;color:rgb(100,116,139);line-height:1.55">${leaf(sub)}</p>`
      }
      cell += `</td>`
      return cell
    }

    const marginTop = idx ? '10px' : '0'
    inner += `<section class="tableWrapper" style="margin:${marginTop} 0 0"><table style="width:100%;border-collapse:separate;border-spacing:8px 0;table-layout:fixed"><tbody><tr>`
    inner += renderCardCell(leftHeader, leftMain, leftSub, 'left')
    inner += `<td style="width:16%;vertical-align:middle;text-align:center;padding:0"><section style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;border-radius:999px;background:rgb(15,23,42);color:#fff;font-size:10px;font-weight:900;letter-spacing:0.5px">${leaf('VS')}</section></td>`
    inner += renderCardCell(rightHeader, rightMain, rightSub, 'right')
    inner += `</tr></tbody></table></section>`
  })

  return cardFrame(t, inner || bodyText('对比内容为空', t))
}

function renderCompareModule(body: Md2wechatModuleBody, t: ThemeColors): string {
  const raw = body.rows.map((r) => r.join(' | ')).join('\n')
  if (/<left>/i.test(raw)) {
    return Compare_DA01.render(body.fields as Record<string, string>, raw, t)
  }
  if (
    body.rows.length > 0 ||
    body.fields['left-title'] ||
    body.fields['right-title'] ||
    body.fields.left ||
    body.fields.right
  ) {
    return renderCompareVs(body, t)
  }
  return Compare_DA01.render(body.fields as Record<string, string>, raw, t)
}

function renderMythFact(body: Md2wechatModuleBody, t: ThemeColors): string {
  let inner = body.label ? hTitle(body.label, '16px') : ''
  body.rows.forEach(([myth, fact]) => {
    if (myth) {
      inner += `<section style="margin:0 0 8px;padding:12px;border-radius:10px;background:rgb(254,242,242);border-left:3px solid rgb(239,68,68)">`
      inner += `<p style="margin:0 0 4px;font-size:11px;font-weight:800;color:rgb(185,28,28)">误区</p><p style="margin:0;font-size:13px;color:rgb(127,29,29)">${leaf(myth)}</p></section>`
    }
    if (fact) {
      inner += `<section style="margin:0 0 12px;padding:12px;border-radius:10px;background:rgb(236,253,245);border-left:3px solid rgb(16,185,129)">`
      inner += `<p style="margin:0 0 4px;font-size:11px;font-weight:800;color:rgb(5,150,105)">事实</p><p style="margin:0;font-size:13px;color:rgb(6,78,59)">${leaf(fact)}</p></section>`
    }
  })
  return cardFrame(t, inner)
}

function renderDefinition(body: Md2wechatModuleBody, t: ThemeColors): string {
  const data = parseJsonContent(body) as { term?: string; def?: string; termLabel?: string } | null
  const term = data?.term || body.fields.term
  const def = data?.def || body.fields.def || body.fields.definition
  let inner = eyebrow(data?.termLabel || body.fields.termLabel || '术语', t)
  if (term) inner += `<p style="margin:0 0 8px;font-size:22px;font-weight:900">${leaf(term)}</p>`
  if (def) inner += bodyText(def, t)
  return cardFrame(t, inner)
}

function renderJsonQa(body: Md2wechatModuleBody, t: ThemeColors): string {
  const data = parseJsonContent(body)
  const items: { q?: string; a?: string }[] = Array.isArray(data) ? data : []
  let inner = ''
  items.forEach((item) => {
    if (!item.q) return
    inner += `<section style="margin:0 0 10px;padding:12px;border-radius:10px;border:1px solid rgb(229,231,235)">`
    inner += `<p style="margin:0 0 6px;font-size:14px;font-weight:700">${leaf(item.q)}</p>`
    if (item.a) inner += bodyText(item.a, t)
    inner += `</section>`
  })
  return cardFrame(t, inner)
}

function renderStatRow(body: Md2wechatModuleBody, t: ThemeColors): string {
  const items = (parseJsonContent(body) as { label?: string; value?: string; unit?: string }[] | null) || []
  let inner = `<section style="display:flex;flex-wrap:wrap;gap:10px">`
  items.forEach((item) => {
    inner += `<section style="flex:1;min-width:100px;padding:14px;border-radius:12px;background:#fff;border:1px solid rgb(229,231,235);text-align:center">`
    if (item.value) inner += `<p style="margin:0;font-size:24px;font-weight:900;color:${t.accent}">${leaf(item.value)}${item.unit ? `<span style="font-size:12px">${leaf(item.unit)}</span>` : ''}</p>`
    if (item.label) inner += `<p style="margin:6px 0 0;font-size:12px;color:rgb(100,116,139)">${leaf(item.label)}</p>`
    inner += `</section>`
  })
  inner += `</section>`
  return cardFrame(t, inner)
}

function renderResourceList(body: Md2wechatModuleBody, t: ThemeColors): string {
  const items = (parseJsonContent(body) as { name?: string; url?: string; desc?: string; icon?: string }[] | null) || []
  let inner = ''
  items.forEach((item) => {
    if (!item.name) return
    inner += `<section style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid rgb(241,245,249)">`
    inner += `<span style="width:32px;height:32px;line-height:32px;text-align:center;border-radius:8px;background:${t.accent}12">${leaf(item.icon || item.name.slice(0, 1))}</span>`
    inner += `<section><p style="margin:0;font-size:14px;font-weight:700;color:${item.url?.startsWith('http') ? t.accent : 'rgb(17,24,39)'}">${leaf(item.name)}</p>`
    if (item.desc) inner += `<p style="margin:4px 0 0;font-size:12px;color:rgb(100,116,139)">${leaf(item.desc)}</p>`
    inner += `</section></section>`
  })
  return cardFrame(t, inner)
}

function renderComparisonTable(body: Md2wechatModuleBody, t: ThemeColors): string {
  if (!body.rows.length) return cardFrame(t, '')
  const [header, ...rows] = body.rows
  let inner = body.label ? hTitle(body.label, '16px') : ''
  inner += `<table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr>`
  header?.forEach((h) => { inner += `<th style="padding:10px;background:${t.accent};color:#fff;border:1px solid ${t.accent}">${leaf(h)}</th>` })
  inner += `</tr></thead><tbody>`
  rows.forEach((row, idx) => {
    inner += `<tr style="background:${idx % 2 ? 'rgb(248,250,252)' : '#fff'}">`
    row.forEach((cell) => { inner += `<td style="padding:10px;border:1px solid rgb(229,231,235)">${leaf(cell)}</td>` })
    inner += `</tr>`
  })
  inner += `</tbody></table>`
  return cardFrame(t, inner)
}

function renderLogos(body: Md2wechatModuleBody, t: ThemeColors): string {
  let inner = body.label ? hTitle(body.label, '16px') : ''
  inner += `<section style="display:flex;flex-wrap:wrap;gap:10px">`
  body.rows.forEach((row) => {
    if (!row[0]) return
    inner += `<span style="padding:10px 14px;border-radius:10px;background:#fff;border:1px solid rgb(229,231,235);font-size:13px;font-weight:700;color:rgb(71,85,105)">${leaf(row[0])}</span>`
  })
  inner += `</section>`
  return cardFrame(t, inner)
}

function renderPeople(body: Md2wechatModuleBody, t: ThemeColors): string {
  let inner = body.label ? hTitle(body.label, '16px') : ''
  body.rows.forEach((row) => {
    const [name, role, desc] = row
    if (!name) return
    inner += `<section style="display:flex;gap:12px;margin:0 0 12px;padding:12px;border-radius:12px;background:#fff;border:1px solid rgb(229,231,235)">`
    inner += `<span style="width:40px;height:40px;border-radius:999px;background:${t.accent};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800">${leaf(name.slice(0, 1))}</span>`
    inner += `<section><p style="margin:0;font-size:14px;font-weight:800">${leaf(name)}</p>`
    if (role) inner += `<p style="margin:2px 0 0;font-size:12px;color:${t.accent}">${leaf(role)}</p>`
    if (desc) inner += `<p style="margin:6px 0 0;font-size:13px;color:rgb(100,116,139)">${leaf(desc)}</p>`
    inner += `</section></section>`
  })
  return cardFrame(t, inner)
}

function renderToolbox(body: Md2wechatModuleBody, t: ThemeColors): string {
  let inner = body.label ? hTitle(body.label, '16px') : ''
  body.rows.forEach((row) => {
    const [category, name, desc] = row
    inner += `<section style="margin:0 0 10px;padding:12px;border-radius:10px;background:#fff;border:1px solid rgb(229,231,235)">`
    if (category) inner += `<p style="margin:0 0 4px;font-size:10px;font-weight:800;color:${t.accent}">${leaf(category)}</p>`
    if (name) inner += `<p style="margin:0 0 4px;font-size:14px;font-weight:700">${leaf(name)}</p>`
    if (desc) inner += `<p style="margin:0;font-size:13px;color:rgb(100,116,139)">${leaf(desc)}</p>`
    inner += `</section>`
  })
  return cardFrame(t, inner)
}

function renderCases(body: Md2wechatModuleBody, t: ThemeColors): string {
  let inner = body.label ? hTitle(body.label, '16px') : ''
  body.rows.forEach((row) => {
    const { cells, accent } = rowCells(row)
    const [title, result, detail] = cells
    if (!title) return
    inner += `<section style="margin:0 0 10px;padding:14px;border-radius:12px;border:1px solid ${accent ? t.accent : 'rgb(229,231,235)'};background:${accent ? `${t.accent}06` : '#fff'}">`
    inner += `<p style="margin:0 0 4px;font-size:15px;font-weight:800">${leaf(title)}</p>`
    if (result) inner += `<p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${t.accent}">${leaf(result)}</p>`
    if (detail) inner += `<p style="margin:0;font-size:13px;color:rgb(100,116,139)">${leaf(detail)}</p>`
    inner += `</section>`
  })
  return cardFrame(t, inner)
}

function renderSpecs(body: Md2wechatModuleBody, t: ThemeColors): string {
  let inner = body.label ? hTitle(body.label, '16px') : ''
  body.rows.forEach((row, idx) => {
    const [key, val] = row
    if (!key) return
    inner += `<section style="display:flex;padding:10px 12px;background:${idx % 2 ? 'rgb(248,250,252)' : '#fff'};border-top:${idx ? '1px solid rgb(241,245,249)' : 'none'}">`
    inner += `<span style="width:38%;font-size:13px;color:rgb(100,116,139);font-weight:600">${leaf(key)}</span>`
    inner += `<span style="flex:1;font-size:13px">${leaf(val || '')}</span></section>`
  })
  return cardFrame(t, `<section style="border-radius:10px;overflow:hidden;border:1px solid rgb(229,231,235)">${inner}</section>`)
}

function renderNotice(body: Md2wechatModuleBody, t: ThemeColors): string {
  const title = body.fields.title || body.label || '公告'
  const content = body.fields.body || body.fields.text || ''
  let inner = `<section style="display:flex;gap:10px"><span style="padding:4px 8px;border-radius:6px;background:rgb(254,243,199);color:rgb(180,83,9);font-size:11px;font-weight:800">!</span><section>`
  inner += `<p style="margin:0 0 6px;font-size:14px;font-weight:800">${leaf(title)}</p>`
  if (content) inner += bodyText(content, t)
  inner += `</section></section>`
  return cardFrame(t, inner)
}

function renderChangelog(body: Md2wechatModuleBody, t: ThemeColors): string {
  let inner = body.label ? hTitle(body.label, '16px') : ''
  body.rows.forEach((row) => {
    const [date, version, changes] = row
    inner += `<section style="margin:0 0 10px;padding:12px;border-left:3px solid ${t.accent};background:rgb(248,250,252)">`
    inner += `<p style="margin:0 0 4px;font-size:12px;color:rgb(100,116,139)">${leaf([date, version].filter(Boolean).join(' · '))}</p>`
    if (changes) inner += `<p style="margin:0;font-size:14px">${leaf(changes)}</p></section>`
  })
  return cardFrame(t, inner)
}

function renderSeries(body: Md2wechatModuleBody, t: ThemeColors): string {
  const { fields } = body
  let inner = eyebrow(fields.label || '系列专栏', t)
  if (fields.title) inner += hTitle(fields.title)
  if (fields.body || fields.description) inner += bodyText(fields.body || fields.description || '', t)
  if (fields.link) inner += `<p style="margin:10px 0 0;font-size:13px;font-weight:700;color:${t.accent}">${leaf(fields.link)} →</p>`
  return cardFrame(t, inner, { accent: true })
}

function renderTweet(body: Md2wechatModuleBody, t: ThemeColors): string {
  const text = body.fields.text || body.fields.body || ''
  const author = body.fields.author || body.label || '作者'
  let inner = `<section style="display:flex;gap:10px"><span style="width:36px;height:36px;border-radius:999px;background:rgb(15,23,42);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800">𝕏</span><section>`
  inner += `<p style="margin:0 0 4px;font-size:13px;font-weight:700">${leaf(author)}</p>`
  if (text) inner += bodyText(text, t)
  inner += `</section></section>`
  return cardFrame(t, inner)
}

function renderImageCompare(body: Md2wechatModuleBody, t: ThemeColors): string {
  const { fields } = body
  let inner = fields.title ? hTitle(fields.title, '16px') : ''
  ;[
    ['前', fields.before || fields.left],
    ['后', fields.after || fields.right],
  ].forEach(([tag, url]) => {
    if (!url) return
    inner += `<section style="margin:0 0 10px"><p style="margin:0 0 6px;font-size:11px;font-weight:800;color:${t.accent}">${tag}</p><img src="${esc(url)}" style="width:100%;border-radius:10px" alt="" /></section>`
  })
  return cardFrame(t, inner)
}

function renderImageSteps(body: Md2wechatModuleBody, t: ThemeColors): string {
  let inner = body.label ? hTitle(body.label, '16px') : ''
  body.rows.forEach((row, idx) => {
    const [step, url, caption] = row
    inner += `<section style="margin:0 0 14px"><p style="margin:0 0 8px;font-size:13px;font-weight:800;color:${t.accent}">步骤 ${idx + 1}${step ? ` · ${leaf(step)}` : ''}</p>`
    if (url?.startsWith('http')) inner += `<img src="${esc(url)}" style="width:100%;border-radius:10px" alt="" />`
    if (caption) inner += `<p style="margin:6px 0 0;font-size:12px;color:rgb(100,116,139)">${leaf(caption)}</p>`
    inner += `</section>`
  })
  return cardFrame(t, inner)
}

function renderImageAnnotate(body: Md2wechatModuleBody, t: ThemeColors): string {
  const { fields } = body
  let inner = fields.title ? hTitle(fields.title, '16px') : ''
  if (fields.image) {
    inner += `<section style="position:relative"><img src="${esc(fields.image)}" style="width:100%;border-radius:10px" alt="" />`
    if (fields.points) {
      splitTags(fields.points).forEach((point, i) => {
        inner += `<span style="position:absolute;left:12px;top:${20 + i * 18}%;padding:4px 8px;border-radius:6px;background:${t.accent};color:#fff;font-size:11px;font-weight:700">${leaf(point)}</span>`
      })
    }
    inner += `</section>`
  }
  if (fields.body) inner += bodyText(fields.body, t)
  return cardFrame(t, inner)
}

function renderLabelTitle(body: Md2wechatModuleBody, t: ThemeColors): string {
  const { fields } = body
  let inner = ''
  if (fields.eyebrow || fields.label) inner += eyebrow(fields.eyebrow || fields.label || '', t)
  if (fields.title) inner += hTitle(fields.title, '20px')
  if (fields.subtitle) inner += bodyText(fields.subtitle, t)
  return sectionWrap(inner)
}

function renderPart(body: Md2wechatModuleBody, t: ThemeColors): string {
  const { fields } = body
  let inner = `<section style="text-align:center;padding:8px 0">`
  inner += eyebrow(fields.label || fields.part || 'PART', t)
  if (fields.title) inner += `<p style="margin:0;font-size:22px;font-weight:900">${leaf(fields.title)}</p>`
  if (fields.subtitle) inner += `<p style="margin:8px 0 0;font-size:13px;color:rgb(100,116,139)">${leaf(fields.subtitle)}</p>`
  inner += `<section style="margin-top:14px;height:1px;background:linear-gradient(90deg,transparent,${t.accent},transparent)"></section></section>`
  return inner
}

const RENDERERS: Record<string, RenderFn> = {
  hero: (body, t, fullMd) =>
    Title_DA02.render(
      {
        badge: body.fields.eyebrow || body.fields.badge || body.label || '',
        subtitle: body.fields.subtitle,
        chips: body.fields.chips,
      },
      body.fields.title || body.fields.heading || '标题',
      t,
      fullMd,
    ),
  timeline: (body, t) =>
    Timeline_DA02.render(
      body.fields as Record<string, string>,
      body.rows.map((r) => `- ${r.join(' | ')}`).join('\n'),
      t,
    ),
  steps: (body, t) => Steps_DA01.render(body.fields as Record<string, string>, body.rows.map((r) => `- ${r.join(' | ')}`).join('\n'), t),
  compare: (body, t) => renderCompareModule(body, t),
  metrics: (body, t) => renderMetrics(body, t),
  cards: (body, t) => renderCards(body, t),
  pricing: (body, t) => renderPricing(body, t),
  toc: (body, t) => renderToc(body, t),
  verdict: (body, t) => renderVerdictFamily('verdict', body, t),
  manifesto: (body, t) => renderVerdictFamily('manifesto', body, t),
  bridge: (body, t) => renderVerdictFamily('bridge', body, t),
  'audience-fit': (body, t) => renderAudienceFit(body, t),
  infographic: (body, t) => renderInfographic(body, t),
  quote: (body, t) => renderQuote(body, t),
  'quote-card': (body, t) =>
    Statement_DA01.render(
      { label: body.fields.eyebrow || body.label || '' },
      body.fields.text || body.fields.quote || '',
      t,
    ),
  'image-text': (body, t) => renderImageText(body, t),
  cta: (body, t) => renderCtaFields(body, t),
  faq: (body, t) => renderFaq(body, t),
  checklist: (body, t) => renderChecklist(body, t),
  summary: (body, t) => renderSummary(body, t),
  callout: (body, t) => Lead_DA01.render({ label: body.fields.title || body.label || '提示' }, body.fields.body || body.fields.text || '', t),
  definition: (body, t) => renderDefinition(body, t),
  question: (body, t) => renderJsonQa(body, t),
  'stat-row': (body, t) => renderStatRow(body, t),
  'resource-list': (body, t) => renderResourceList(body, t),
  'comparison-table': (body, t) => renderComparisonTable(body, t),
  subscribe: (body, t) => renderSubscribe(body, t),
  'author-card': (body, t) => renderAuthorCard(body, t),
  'myth-fact': (body, t) => renderMythFact(body, t),
  logos: (body, t) => renderLogos(body, t),
  people: (body, t) => renderPeople(body, t),
  toolbox: (body, t) => renderToolbox(body, t),
  cases: (body, t) => renderCases(body, t),
  specs: (body, t) => renderSpecs(body, t),
  notice: (body, t) => renderNotice(body, t),
  changelog: (body, t) => renderChangelog(body, t),
  series: (body, t) => renderSeries(body, t),
  tweet: (body, t) => renderTweet(body, t),
  'label-title': (body, t) => renderLabelTitle(body, t),
  part: (body, t) => renderPart(body, t),
  'image-compare': (body, t) => renderImageCompare(body, t),
  'image-steps': (body, t) => renderImageSteps(body, t),
  'image-annotate': (body, t) => renderImageAnnotate(body, t),
}

export function renderDedicatedMd2wechatModule(name: string, body: Md2wechatModuleBody, t: ThemeColors, fullMd: string): string | null {
  const fn = RENDERERS[name]
  return fn ? fn(body, t, fullMd) : null
}
