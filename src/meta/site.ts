/** GitHub 仓库地址，可通过 VITE_GITHUB_REPO_URL 覆盖 */
export const GITHUB_REPO_URL =
  import.meta.env.VITE_GITHUB_REPO_URL ?? 'https://github.com/DuebassLei/md-wechat-editor'

/** 顶栏公众号推广（设 VITE_WECHAT_MP_PROMO_ENABLED=false 可关闭） */
export const WECHAT_MP_PROMO = {
  enabled: import.meta.env.VITE_WECHAT_MP_PROMO_ENABLED !== 'false',
  accountName: (import.meta.env.VITE_WECHAT_MP_NAME as string | undefined)?.trim() || '海边的小鱼干',
  hint: (import.meta.env.VITE_WECHAT_MP_HINT as string | undefined)?.trim() || 'AI 编程 · Vibe Coding',
  tagline:
    (import.meta.env.VITE_WECHAT_MP_TAGLINE as string | undefined)?.trim() ||
    'AI 编程笔记 · Vibe Coding 实战 · 开发者效率',
  href: (import.meta.env.VITE_WECHAT_MP_URL as string | undefined)?.trim() || '',
  /** 默认二维码图；未设置时使用 public/wechat-mp-qr.png */
  qrCodeUrl: (import.meta.env.VITE_WECHAT_MP_QR_URL as string | undefined)?.trim() || '',
  topics: ['Cursor', 'Vibe Coding', 'Agent', '提示词', 'MCP', '效率工具'] as const,
  benefits: [
    'AI 编程工作流拆解与工具实测',
    'Cursor / Claude Code 技巧与踩坑记录',
    'Vibe Coding 项目灵感与 Prompt 模板',
    '墨韵简排更新与公众号排版干货',
  ] as const,
} as const
