import { ref, watch } from 'vue'

export interface LocalDoc {
  id: string
  title: string
  content: string
  themeId: string
  updatedAt: number
}

const LIST_KEY = 'moyun-jianpai-docs'
const ACTIVE_KEY = 'moyun-jianpai-active-doc'
const PERSIST_DEBOUNCE_MS = 500

function loadList(): LocalDoc[] {
  try {
    const raw = localStorage.getItem(LIST_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as LocalDoc[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveList(docs: LocalDoc[]): boolean {
  try {
    localStorage.setItem(LIST_KEY, JSON.stringify(docs))
    return true
  } catch (e) {
    if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.code === 22)) {
      console.warn('[useLocalDocs] localStorage 配额已满，文档未能保存')
    }
    return false
  }
}

export function useLocalDocs() {
  const docs = ref<LocalDoc[]>(loadList())
  const activeId = ref<string | null>(localStorage.getItem(ACTIVE_KEY))
  const persistError = ref('')
  let persistTimer: ReturnType<typeof setTimeout> | null = null

  function persistActiveId() {
    if (activeId.value) localStorage.setItem(ACTIVE_KEY, activeId.value)
    else localStorage.removeItem(ACTIVE_KEY)
  }

  function persistDocsNow() {
    const ok = saveList(docs.value)
    persistError.value = ok ? '' : '本地存储空间不足，部分内容可能未保存'
    return ok
  }

  function schedulePersistDocs() {
    if (persistTimer) clearTimeout(persistTimer)
    persistTimer = setTimeout(() => {
      persistDocsNow()
      persistTimer = null
    }, PERSIST_DEBOUNCE_MS)
  }

  watch(docs, schedulePersistDocs, { deep: true })
  watch(activeId, persistActiveId)

  function createDoc(title = '未命名文档'): LocalDoc {
    const doc: LocalDoc = {
      id: crypto.randomUUID(),
      title,
      content: '',
      themeId: 'normal',
      updatedAt: Date.now(),
    }
    docs.value = [doc, ...docs.value]
    activeId.value = doc.id
    return doc
  }

  function deleteDoc(id: string): LocalDoc | null {
    const index = docs.value.findIndex((d) => d.id === id)
    if (index < 0) return null
    const removed = docs.value[index]
    docs.value = docs.value.filter((d) => d.id !== id)
    if (activeId.value === id) {
      activeId.value = docs.value[0]?.id ?? null
    }
    return { ...removed }
  }

  function restoreDoc(doc: LocalDoc, index?: number) {
    if (docs.value.some((d) => d.id === doc.id)) return
    const next = [...docs.value]
    const at = index == null ? 0 : Math.min(Math.max(index, 0), next.length)
    next.splice(at, 0, doc)
    docs.value = next
    activeId.value = doc.id
  }

  function renameDoc(id: string, title: string) {
    const doc = docs.value.find((d) => d.id === id)
    if (doc) {
      doc.title = title.trim() || '未命名文档'
      doc.updatedAt = Date.now()
    }
  }

  function updateDoc(id: string, patch: Partial<Pick<LocalDoc, 'content' | 'themeId' | 'title'>>) {
    const doc = docs.value.find((d) => d.id === id)
    if (!doc) return
    Object.assign(doc, patch)
    doc.updatedAt = Date.now()
  }

  function activeDoc(): LocalDoc | null {
    if (!activeId.value) return null
    return docs.value.find((d) => d.id === activeId.value) ?? null
  }

  function flushPersist() {
    if (persistTimer) {
      clearTimeout(persistTimer)
      persistTimer = null
    }
    persistDocsNow()
    persistActiveId()
  }

  return {
    docs,
    activeId,
    persistError,
    createDoc,
    deleteDoc,
    restoreDoc,
    renameDoc,
    updateDoc,
    activeDoc,
    flushPersist,
  }
}
