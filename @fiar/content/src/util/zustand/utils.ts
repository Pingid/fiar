import { StoreApi } from 'zustand'

export const narrow = <T extends any, B>(store: StoreApi<T>, select: (state: T) => B, handler: (x: B) => void) => {
  let last: any = Symbol()
  return store.subscribe((state, _prev) => {
    const next = select(state)
    if (next === last) return
    last = next
    handler(next)
  })
}

export const whenSubscribed = <T extends any>(store: StoreApi<T>, handler: () => () => void) => {
  const subs = new Set()
  let listener: (() => void) | null = null
  const subscribe = store.subscribe
  store.subscribe = (fn) => {
    subs.add(fn)
    if (listener) return subscribe(fn)
    listener = handler()
    const unsub = subscribe(fn)
    return () => {
      subs.delete(fn)
      if (listener && subs.size === 0) {
        listener()
        listener = null
      }
      unsub()
    }
  }
}
