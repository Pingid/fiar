import { ElementRef, ElementType, ForwardedRef, useRef } from 'react'

export const usePassRef = <K extends ElementType>(
  ref?: ForwardedRef<ElementRef<K>> | undefined,
): React.RefObject<ElementRef<K>> => {
  const inner = useRef<ElementRef<K>>(null)
  return {
    get current() {
      return inner.current
    },
    set current(x: ElementRef<K> | null) {
      ;(inner.current as any) = x
      if (!ref) return
      if (typeof ref === 'function') ref(x)
      else ref.current = x
    },
  }
}
