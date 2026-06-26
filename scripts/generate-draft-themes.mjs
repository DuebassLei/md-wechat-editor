/**
 * 从 previews/wechat-theme-drafts/*.html 生成 markdownThemes/drafts/*.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const draftsDir = path.join(root, 'previews/wechat-theme-drafts')
const outDir = path.join(root, 'src/engine/themes/markdownThemes/drafts')

const DEFINITIONS = [
  { file: 'zhu-yin-seal', id: 'zhuYinSeal', name: '朱砂印谱', description: '米宣纸底 + 朱印点缀 + 宋体居中引文', primary: '#8B1E1E', series: '文化系列' },
  { file: 'deep-letter', id: 'deepLetter', name: '深海信笺', description: '深夜蓝底 + 金线分隔 + 衬线长文', primary: '#C9A961', series: '文化系列' },
  { file: 'mint-scrapbook', id: 'mintScrapbook', name: '薄荷手帐', description: '手账纸纹 + 和纸胶带标题 + 圆角卡片引文', primary: '#7ECBA1', series: '手账系列' },
  { file: 'peach-scrapbook', id: 'peachScrapbook', name: '蜜桃手帐', description: '暖橙奶黄胶带 + 网格纸底', primary: '#FDBA74', series: '手账系列' },
  { file: 'lavender-scrapbook', id: 'lavenderScrapbook', name: '薰衣草手帐', description: '淡紫网格 + 粉紫胶带', primary: '#A78BFA', series: '手账系列' },
  { file: 'sky-scrapbook', id: 'skyScrapbook', name: '晴空手帐', description: '天蓝柠檬双拼胶带', primary: '#93C5FD', series: '手账系列' },
  { file: 'soft-round', id: 'softRound', name: '圆润物语', description: '左色条标题 + 细描边胶囊 + 轻阴影卡片', primary: '#5B6CFE', series: '现代系列' },
  { file: 'fresh-breeze', id: 'freshBreeze', name: '清风浅蓝', description: '天蓝 + 薄荷白底 + 通透间距', primary: '#38BDF8', series: '现代系列' },
  { file: 'formal-graphite', id: 'formalGraphite', name: '石墨简报', description: '黑白极简 + 左色条分节', primary: '#171717', series: '正式系列' },
  { file: 'formal-navy', id: 'formalNavy', name: '藏青纪事', description: '深藏青标题块 + 权威感', primary: '#1E3A5F', series: '正式系列' },
  { file: 'formal-editorial', id: 'formalEditorial', name: '专栏纪述', description: '衬线居中 + 报刊分节', primary: '#78716C', series: '正式系列' },
  { file: 'cute-bubble', id: 'cuteBubble', name: '软萌泡泡', description: '马卡龙粉 + 气泡标题 + emoji 角标', primary: '#FF8FAB', series: '可爱系列' },
  { file: 'cute-milk-tea', id: 'cuteMilkTea', name: '奶茶波波', description: '奶咖焦糖 + 立体胶囊 + 贴纸引文', primary: '#D4A574', series: '可爱系列' },
  { file: 'cute-star-dream', id: 'cuteStarDream', name: '星梦软糖', description: '紫蓝梦境 + 星月角标', primary: '#A78BFA', series: '可爱系列' },
  { file: 'cute-lemon-fizz', id: 'cuteLemonFizz', name: '柠檬汽水', description: '黄绿撞色 + 气泡感', primary: '#FACC15', series: '可爱系列' },
  { file: 'cute-matcha-cloud', id: 'cuteMatchaCloud', name: '抹茶云朵', description: '抹茶绿 + 奶黄双拼', primary: '#6EE7B7', series: '可爱系列' },
  { file: 'cute-blueberry-jelly', id: 'cuteBlueberryJelly', name: '蓝莓果冻', description: '靛蓝冰透 + 果冻质感', primary: '#818CF8', series: '可爱系列' },
  { file: 'cute-shuitun-lulu', id: 'cuteShuitunLulu', name: '水豚噜噜', description: '芒果暖黄 + 头顶小橙，佛系治愈', primary: '#FBBF24', series: '可爱系列' },
  { file: 'tech-grid', id: 'techGrid', name: '极客蓝图', description: '网格底纹 + 等宽点缀 + 蓝色信息块', primary: '#0EA5E9', series: '现代系列' },
]

/** 剥离 body / .phone / .bar，保留完整 #nice 规则（含逗号选择器） */
function extractNiceCss(html) {
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i)
  if (!styleMatch) throw new Error('no style block')

  let style = styleMatch[1]
  style = style.replace(/\/\*[\s\S]*?\*\//g, '')
  style = style.replace(/(?:^|[\n\r}])\s*(?:body|\.phone|\.bar)[^{]*\{[^}]*\}/g, '')

  const rules = []
  let i = 0
  while (i < style.length) {
    const idx = style.indexOf('#nice', i)
    if (idx === -1) break

    let j = idx
    while (j < style.length && style[j] !== '{') j++
    if (j >= style.length) break

    let depth = 0
    let k = j
    while (k < style.length) {
      if (style[k] === '{') depth++
      else if (style[k] === '}') {
        depth--
        if (depth === 0) {
          k++
          break
        }
      }
      k++
    }

    rules.push(style.slice(idx, k).trim())
    i = k
  }

  return rules.join('\n\n')
}

/** juice / 微信内联不支持 var()，圆润物语需展平变量 */
function flattenCssVariables(css) {
  const vars = {}
  const rootMatch = css.match(/#nice\s*\{([^}]*)\}/)
  if (!rootMatch) return css

  for (const line of rootMatch[1].split('\n')) {
    const m = line.match(/^\s*(--[\w-]+)\s*:\s*(.+?)\s*;/)
    if (m) vars[m[1]] = m[2]
  }

  if (Object.keys(vars).length === 0) return css

  let out = css.replace(/^\s*--[\w-]+:[^;]+;\s*$/gm, '')
  for (const [name, value] of Object.entries(vars)) {
    out = out.replaceAll(`var(${name})`, value)
  }
  return out
}

function augmentHeadingContent(css, level) {
  const re = new RegExp(`#nice ${level} \\.content \\{([^}]*)\\}`, 'g')
  return css.replace(re, (full, body) => {
    if (body.includes('max-width:')) return full
    const trimmed = body.trimEnd()
    return `#nice ${level} .content {${trimmed}
  max-width: 100%;
  box-sizing: border-box;
  word-break: break-word;
}`
  })
}

/** 对齐 HTML 预览，并覆盖 wechatBaseCss 的默认干扰 */
function adaptCss(css, name) {
  let out = flattenCssVariables(css)

  out = out.replace(/#nice blockquote \{/g, '#nice blockquote,\n#nice .multiquote-1 {')

  out = out.replace(/\n#nice \.multiquote-1 \{\s*margin: inherit;[\s\S]*?\}\n/g, '\n')

  out = out.replace(/#nice p \{([^}]*)\}/, (full, body) => {
    if (body.includes('padding-top')) return full
    return `#nice p {${body} padding-top: 0; padding-bottom: 0; }`
  })

  if (out.includes('#nice h1 .prefix::before') && !out.includes('#nice h1 .prefix,')) {
    out = out.replace(
      /#nice h1 \.suffix \{ display: inline([^}]*)\}/,
      '#nice h1 .prefix, #nice h1 .suffix { display: inline$1}',
    )
    if (!out.includes('#nice h1 .prefix,')) {
      out += '\n#nice h1 .prefix, #nice h1 .suffix { display: inline; }\n'
    }
  }

  if (out.includes('#nice h2 .suffix { display: none') && !out.includes('#nice h2 .prefix,')) {
    out = out.replace(
      /#nice h2 \.suffix \{ display: none; \}/,
      '#nice h2 .prefix, #nice h2 .suffix { display: none; }',
    )
  }

  if (out.includes('#nice h2 .prefix { display: inline') && !out.includes('#nice h2 .prefix,')) {
    out = out.replace(
      /#nice h2 \.prefix \{ display: inline([^}]*)\}/,
      '#nice h2 .prefix { display: inline$1}',
    )
  }

  if (out.includes('#nice h2 .prefix::before') && out.includes('#nice h2 .suffix::after')) {
    if (!out.includes('#nice h2 .prefix, #nice h2 .suffix { display: inline')) {
      out += '\n#nice h2 .prefix, #nice h2 .suffix { display: inline; }\n'
    }
  }

  if (out.includes('#nice h3 .prefix::before') && !out.match(/#nice h3 \.prefix[^{]*\{[^}]*display/)) {
    out += '\n#nice h3 .prefix { display: inline; }\n'
  }

  for (const level of ['h1', 'h2', 'h3']) {
    if (out.includes(`#nice ${level} .content`)) {
      out = augmentHeadingContent(out, level)
    }
  }

  if (out.includes('#nice hr::before')) {
    out = out.replace(/(#nice hr \{[^}]*\})/, (block) => {
      if (block.includes('display:')) return block
      return block.replace(/\{\s*/, '{\n  display: block;\n  ')
    })
  }

  if (out.includes('#nice pre {') && !out.includes('#nice pre code {')) {
    out += `
#nice pre code {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
}`
  }

  out += `
#nice h1, #nice h2, #nice h3, #nice h4, #nice h5, #nice h6 {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
}
`

  const extras = `
#nice li section {
  margin-top: 0;
  margin-bottom: 0;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  font-weight: inherit;
}

#nice img {
  display: block;
  max-width: 100%;
  margin: 1.2em auto;
}

#nice figcaption {
  margin-top: 0.5em;
  font-size: 13px;
  text-align: center;
  opacity: 0.75;
}

#nice table tr th,
#nice table tr td {
  font-size: inherit;
}`.trim()

  if (!out.includes('#nice li section')) {
    out += `\n\n${extras}`
  }

  return `/** ${name} */\n${out}`
}

fs.mkdirSync(outDir, { recursive: true })

const imports = []
const themeEntries = []
const defLines = []

for (const def of DEFINITIONS) {
  const htmlPath = path.join(draftsDir, `${def.file}.html`)
  const html = fs.readFileSync(htmlPath, 'utf8')
  const css = adaptCss(extractNiceCss(html), def.name)
  const varName = def.id
  const outPath = path.join(outDir, `${varName}.ts`)

  fs.writeFileSync(
    outPath,
    `export default \`${css.replace(/`/g, '\\`')}\`;\n`,
    'utf8',
  )

  imports.push(`import ${varName} from './${varName}'`)
  themeEntries.push(`  ${varName},`)
  defLines.push(`  {
    id: '${def.id}',
    name: '${def.name}',
    description: '${def.description}',
    primary: '${def.primary}',
    series: '${def.series}' as const,
  },`)
}

const generated = `${imports.join('\n')}

export const DRAFT_THEME_DEFINITIONS = [
${defLines.join('\n')}
] as const

export const DRAFT_THEMES: Record<string, string> = {
${themeEntries.join('\n')}
}

export type DraftThemeId = (typeof DRAFT_THEME_DEFINITIONS)[number]['id']
`

fs.writeFileSync(path.join(outDir, 'generated.ts'), generated, 'utf8')
console.log(`Generated ${DEFINITIONS.length} draft themes in ${outDir}`)
