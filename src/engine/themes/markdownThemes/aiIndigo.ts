/**
 * AI 靛紫 — 参考公众号文章排版
 * https://mp.weixin.qq.com/s/BftXGRmb5XtlLTleTfQNIg
 * 靛蓝渐变强调 + 浅紫信息块 + 圆角表格
 *
 * 文首渐变封面：选用本主题时由 buildWechatArticleHtml 自动插入（见 wechatAiIndigoHero.ts）
 * - 默认取文内第一个 # 标题作封面主标题，其后首段作副标题（并从正文移除以免重复）
 * - 可选 YAML：heroTag / heroTitle / heroSubtitle
 * - 标签行：heroTags / tags / keywords（逗号分隔）或正文【标签】a · b
 * - 目录卡：tocTitle、tocPrev、tocPrevUrl 或【目录】【上一篇】
 * - 文末互动 CTA：默认追加；cta: false 关闭；ctaTitle / ctaLabels / ctaThanks 自定义
 */
export default `/* 全局属性 */
#nice .awp-ai-indigo-hero {
  margin-left: -16px;
  margin-right: -16px;
  width: calc(100% + 32px);
  max-width: none;
}

#nice .awp-ai-indigo-tags {
  margin-left: -16px;
  margin-right: -16px;
  width: calc(100% + 32px);
  max-width: none;
  padding: 16px 12px 12px;
  background: #111827;
  text-align: center;
  text-indent: 0;
}

#nice .awp-ai-indigo-tags__row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  text-indent: 0;
}

#nice .awp-ai-indigo-tag {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  text-indent: 0;
}

#nice .awp-ai-indigo-toc {
  margin: 0 0 20px;
  padding: 0 12px;
  text-indent: 0;
}

#nice .awp-ai-indigo-toc__card {
  margin: 0;
  padding: 16px 18px;
  border-radius: 12px;
  background: #1f2937;
  color: #e5e7eb;
  text-indent: 0;
}

#nice .awp-ai-indigo-toc__head {
  margin: 0 0 12px;
  padding: 0;
  font-size: 13px;
  color: #9ca3af;
  text-indent: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1.5;
}

#nice .awp-ai-indigo-toc__prev,
#nice .awp-ai-indigo-toc__link {
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 1.65;
  text-indent: 0;
}

#nice .awp-ai-indigo-toc__prev {
  color: #d1d5db;
}

#nice a.awp-ai-indigo-toc__link {
  color: #c7d2fe;
  font-weight: 500;
  border-bottom: none;
  text-decoration: none;
}

#nice .awp-ai-indigo-cta {
  margin: 20px 0 0;
  padding: 16px 12px 14px;
  background: #f8f9fb;
  text-align: center;
  text-indent: 0;
  border-bottom: 1px dashed #e2e8f0;
}

#nice .awp-ai-indigo-cta__title {
  margin: 0;
  padding: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.45;
  color: #1e293b;
  text-indent: 0;
}

#nice .awp-ai-indigo-cta__icons {
  margin: 10px 0 8px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  text-indent: 0;
}

#nice .awp-ai-indigo-cta__labels {
  margin: 0 0 10px;
  padding: 0;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  color: #4f46e5;
  text-indent: 0;
}

#nice .awp-ai-indigo-cta__thanks {
  margin: 0;
  padding: 0;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.3;
  color: #cbd5e1;
  text-indent: 0;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

#nice {
  padding: 16px 0;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", "Noto Sans SC", sans-serif;
  color: #374151;
  line-height: 1.9;
  letter-spacing: 0.02em;
  word-spacing: 0.05em;
  text-align: left;
  text-indent: 0;
  background: #f6f7f9;
}

#nice p {
  margin: 16px 0;
  padding: 0;
  font-size: 15px;
  color: #374151;
  line-height: 1.9;
  text-indent: 0;
  word-break: break-word;
}

#nice h1 {
  margin: 24px 0 16px;
  padding: 0;
  text-align: left;
  border-bottom: none;
}

#nice h1 .content {
  display: inline-block;
  font-size: 1.4em;
  font-weight: 700;
  line-height: 1.5;
  color: #3730a3;
  padding: 8px 0;
}

#nice h1 .prefix,
#nice h1 .suffix {
  display: none;
}

#nice h2 {
  margin: 24px 0 12px;
  padding: 0;
  text-align: left;
  border-bottom: none;
}

#nice h2 .content {
  display: inline-flex;
  align-items: center;
  font-size: 1.15em;
  font-weight: 700;
  color: #3730a3;
  padding: 4px 0 4px 12px;
  border-left: 4px solid #5856e9;
}

#nice h2 .prefix,
#nice h2 .suffix {
  display: none;
}

#nice h3 {
  margin: 20px 0 10px;
  padding: 0;
  text-align: left;
}

#nice h3 .content {
  font-size: 1.05em;
  font-weight: 700;
  color: #4f46e5;
}

#nice h3 .prefix,
#nice h3 .suffix {
  display: none;
}

#nice h4 .content,
#nice h5 .content,
#nice h6 .content {
  font-size: 1em;
  font-weight: 600;
  color: #4f46e5;
}

#nice ul {
  margin: 12px 0;
  padding-left: 1.25em;
  list-style-type: disc;
  color: #374151;
}

#nice ol {
  margin: 12px 0;
  padding-left: 1.35em;
  list-style-type: decimal;
  color: #374151;
}

#nice li section {
  font-size: 15px;
  line-height: 1.85;
  color: #374151;
}

#nice blockquote,
#nice .multiquote-1 {
  margin: 16px 0;
  padding: 14px 16px;
  border: 1px solid #ddd6fe;
  border-left: 4px solid #5856e9;
  border-radius: 10px;
  background: #f5f3ff;
  color: #374151;
  text-indent: 0;
}

#nice blockquote p {
  margin: 6px 0;
  color: #374151;
}

#nice a {
  color: #4f46e5;
  font-weight: 600;
  border-bottom: 1px solid #c7d2fe;
  text-decoration: none;
}

#nice strong {
  color: #3730a3;
  font-weight: 700;
}

#nice em {
  color: #4b5563;
  font-style: italic;
}

#nice del {
  color: #9ca3af;
}

#nice hr {
  margin: 24px 0;
  border: none;
  border-top: 1px solid #e5e7eb;
  height: 0;
}

#nice img {
  display: block;
  max-width: 100%;
  margin: 16px auto;
  border-radius: 10px;
  border: 1px solid #ddd6fe;
}

#nice figcaption {
  margin-top: 8px;
  font-size: 13px;
  color: #818cf8;
  text-align: center;
}

#nice p code,
#nice li code {
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.9em;
  color: #4f46e5;
  background: #f5f3ff;
  border: 1px solid #ede9fe;
}

#nice pre {
  margin: 16px 0;
  padding: 14px 16px;
  border-radius: 10px;
  background: #1e1b4b;
  overflow-x: auto;
}

#nice pre code {
  color: #e0e7ff;
  font-size: 13px;
  line-height: 1.6;
  background: transparent;
  border: none;
  padding: 0;
}

#nice table {
  width: 100%;
  margin: 16px 0;
  border-collapse: collapse;
  font-size: 14px;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid #ddd6fe;
}

#nice table tr th {
  background: #4f46e5;
  color: #ffffff;
  font-weight: 700;
  padding: 10px 8px;
  border-bottom: 2px solid #ddd6fe;
  text-align: center;
}

#nice table tr td {
  padding: 10px 8px;
  border-bottom: 1px solid #ddd6fe;
  color: #374151;
  text-align: center;
  background: #ffffff;
}

#nice table tr:nth-child(even) td {
  background: #f5f3ff;
}

#nice .footnote-word {
  color: #4f46e5;
}

#nice .footnote-ref {
  color: #5856e9;
}

#nice .footnotes-sep:before {
  color: #3730a3;
}

#nice .footnote-item p {
  color: #6b7280;
  font-size: 14px;
}
`;
