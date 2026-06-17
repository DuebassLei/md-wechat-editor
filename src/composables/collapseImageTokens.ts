import { Decoration, ViewPlugin, WidgetType, EditorView, type ViewUpdate } from '@codemirror/view'
import { RangeSetBuilder } from '@codemirror/state'
import { IMAGE_TOKEN_PATTERN } from '@/engine/image-pipeline/types'

const MDWE_IMG_RE = new RegExp(`mdwe-img:(${IMAGE_TOKEN_PATTERN})`, 'g')

const LEGACY_TOKEN_RE = new RegExp(
  `data:image\\/([^;"]+);base64,(${IMAGE_TOKEN_PATTERN})`,
  'g',
)

class ImageTokenPlaceholder extends WidgetType {
  mime: string

  constructor(mime: string) {
    super()
    this.mime = mime
  }

  eq(other: ImageTokenPlaceholder) {
    return this.mime === other.mime
  }

  toDOM() {
    const span = document.createElement('span')
    span.className = 'cm-image-token-fold'
    span.textContent = this.mime === 'jpeg' ? '[本地图]' : `${this.mime} [本地图]`
    return span
  }
}

function addFoldDecorations(
  builder: RangeSetBuilder<Decoration>,
  text: string,
  match: RegExpExecArray,
  mime: string,
  tokenStart: number,
  tokenEnd: number,
) {
  builder.add(
    tokenStart,
    tokenEnd,
    Decoration.replace({ widget: new ImageTokenPlaceholder(mime) }),
  )
}

export const collapseImageTokens = ViewPlugin.fromClass(
  class {
    decorations

    constructor(view: EditorView) {
      this.decorations = this.build(view)
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.build(update.view)
      }
    }

    build(view: EditorView) {
      const builder = new RangeSetBuilder<Decoration>()
      const text = view.state.doc.toString()

      let match: RegExpExecArray | null
      const mdweRe = new RegExp(MDWE_IMG_RE.source, 'g')
      while ((match = mdweRe.exec(text)) !== null) {
        addFoldDecorations(builder, text, match, 'jpeg', match.index, match.index + match[0].length)
      }

      const legacyRe = new RegExp(LEGACY_TOKEN_RE.source, 'g')
      while ((match = legacyRe.exec(text)) !== null) {
        addFoldDecorations(builder, text, match, match[1], match.index, match.index + match[0].length)
      }

      return builder.finish()
    }
  },
  { decorations: (v) => v.decorations },
)

export const imageTokenFoldTheme = EditorView.baseTheme({
  '.cm-image-token-fold': {
    display: 'inline',
    fontSize: '11px',
    padding: '1px 5px',
    borderRadius: '3px',
    border: '1px solid rgb(var(--paper-line-rgb))',
    color: 'rgb(var(--ink-muted-rgb))',
    background: 'rgb(var(--paper-dim-rgb) / 0.9)',
    whiteSpace: 'nowrap',
  },
})
