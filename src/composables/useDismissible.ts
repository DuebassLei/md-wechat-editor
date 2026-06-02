import { onMounted, onUnmounted, type Ref } from 'vue'

/** 点击外部或按 Esc 关闭浮层 */
export function useDismissible(
  open: Ref<boolean>,
  rootRef: Ref<HTMLElement | null>,
  onClose?: () => void,
) {
  function close() {
    open.value = false
    onClose?.()
  }

  function onPointerDown(e: PointerEvent) {
    if (!open.value || !rootRef.value) return
    const target = e.target as Node | null
    if (target && !rootRef.value.contains(target)) close()
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!open.value || e.key !== 'Escape') return
    e.preventDefault()
    close()
  }

  onMounted(() => {
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('keydown', onKeyDown)
  })

  return { close }
}
