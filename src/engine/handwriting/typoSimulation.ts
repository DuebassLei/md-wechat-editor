const RULE_RE = /\{([^=>]+)=>([^}]+)\}/g

export interface TypoRule {
  wrong: string
  right: string
}

export interface TypoSimulationResult {
  /** 移除规则 token、应用替换后的展示文本 */
  displayText: string
  /** 解析出的有效规则 */
  rules: TypoRule[]
}

/** 提取规则；无效（空 wrong/right）跳过 */
export function parseTypoRules(source: string): TypoRule[] {
  const rules: TypoRule[] = []
  let match: RegExpExecArray | null
  const re = new RegExp(RULE_RE.source, 'g')
  while ((match = re.exec(source)) !== null) {
    const wrong = match[1].trim()
    const right = match[2].trim()
    if (wrong && right) rules.push({ wrong, right })
  }
  return rules
}

/** 移除 {错=>正} token，并按 正→错 全局替换 */
export function applyTypoSimulation(source: string): TypoSimulationResult {
  const rules = parseTypoRules(source)
  let body = source.replace(RULE_RE, '')

  // 同一正字冲突：后出现的规则覆盖（按在原文中出现顺序）
  const map = new Map<string, string>()
  for (const { wrong, right } of rules) {
    map.set(right, wrong)
  }

  for (const [right, wrong] of map) {
    body = body.split(right).join(wrong)
  }

  return {
    displayText: body.trim(),
    rules,
  }
}

export function hasExportableText(source: string): boolean {
  return applyTypoSimulation(source).displayText.length > 0
}
