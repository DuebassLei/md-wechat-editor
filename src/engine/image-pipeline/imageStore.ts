import type { StoredImage } from './types'

const DB_NAME = 'mdwe-image-store'
const STORE_NAME = 'images'
const DB_VERSION = 2

type GlobalImageCache = { __mdweImageCache?: Map<string, StoredImage> }

function getMemoryCache(): Map<string, StoredImage> {
  const g = globalThis as GlobalImageCache
  if (!g.__mdweImageCache) g.__mdweImageCache = new Map()
  return g.__mdweImageCache
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('当前环境不支持本地图库'))
      return
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'token' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('打开图库失败'))
  })
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then((db) => {
    return new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode)
      const store = tx.objectStore(STORE_NAME)
      const req = fn(store)
      let result: T | undefined

      req.onsuccess = () => {
        result = req.result as T
      }
      req.onerror = () => reject(req.error ?? new Error('图库操作失败'))

      tx.oncomplete = () => {
        db.close()
        resolve(result as T)
      }
      tx.onerror = () => {
        db.close()
        reject(tx.error ?? new Error('图库事务失败'))
      }
    })
  })
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('读取图片失败'))
    reader.readAsDataURL(blob)
  })
}

async function hydrateRecord(record: StoredImage): Promise<StoredImage> {
  if (record.dataUrl?.startsWith('data:')) return record
  if (record.blob instanceof Blob && record.blob.size > 0) {
    const dataUrl = await blobToDataUrl(record.blob)
    const hydrated = { ...record, dataUrl }
    getMemoryCache().set(record.token, hydrated)
    void runTransaction('readwrite', (store) => store.put(hydrated))
    return hydrated
  }
  return record
}

export async function saveStoredImage(record: StoredImage): Promise<void> {
  getMemoryCache().set(record.token, record)
  await runTransaction('readwrite', (store) => store.put(record))
}

export async function getStoredImage(token: string): Promise<StoredImage | null> {
  const cached = getMemoryCache().get(token)
  if (cached) return hydrateRecord(cached)

  const row = await runTransaction<StoredImage | undefined>('readonly', (store) => store.get(token))
  if (row) {
    const hydrated = await hydrateRecord(row)
    getMemoryCache().set(token, hydrated)
    return hydrated
  }
  return null
}

export async function deleteStoredImage(token: string): Promise<void> {
  getMemoryCache().delete(token)
  await runTransaction('readwrite', (store) => store.delete(token))
}

export async function updatePublishedUrl(
  token: string,
  url: string,
  provider: string,
): Promise<void> {
  const existing = await getStoredImage(token)
  if (!existing) return
  await saveStoredImage({
    ...existing,
    publishedUrl: url,
    publishedProvider: provider,
    publishedAt: Date.now(),
  })
}

export async function listAllStoredTokens(): Promise<string[]> {
  const idbKeys = await runTransaction<IDBValidKey[]>('readonly', (store) => store.getAllKeys()).then(
    (keys) => keys.map(String),
  )
  const merged = new Set<string>([...getMemoryCache().keys(), ...idbKeys])
  return [...merged]
}

/** 启动时预热内存缓存（可选，失败静默） */
export async function warmImageStoreCache(): Promise<void> {
  try {
    const rows = await runTransaction<StoredImage[]>('readonly', (store) => store.getAll())
    for (const row of rows) {
      if (row?.token) getMemoryCache().set(row.token, row)
    }
  } catch {
    // ignore
  }
}
