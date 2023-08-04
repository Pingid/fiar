import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'

export type ProxyState<T extends { readonly [x: string]: any }> = T & {
  <K extends keyof T>(key: K): T[K]
  <K extends keyof T>(key: K, value: T[K]): void
}

export const useProxyState = <A extends { readonly [x: string]: any }, B extends { readonly [x: string]: any } = {}>(
  a: A,
  b?: B,
): ProxyState<{ [K in keyof (A & B)]: (A & B)[K] }> => {
  const [, inc] = useReducer((a) => a + 1, 0)
  const timeout_ref = useRef<any>(null)
  const update = useCallback(() => {
    clearTimeout(timeout_ref.current)
    timeout_ref.current = setTimeout(() => inc(), 0)
  }, [inc])

  const ref = useRef({ ...a, ...b })
  useEffect(() => void (ref.current = { ...ref.current, ...b }), [b])

  const value = useMemo(() => {
    const subbed = new Set()
    return new Proxy<ProxyState<A & B>>((() => {}) as any, {
      apply: (_t, _a, args) => {
        if (args.length === 0) throw new Error(`Requires arguments`)
        if (args.length === 1) return ref.current[args[0]] as any
        ;(ref.current[args[0]] as any) = args[1]
        return true
      },
      get: (_t, key) => {
        subbed.add(key)
        return ref.current[key as any]
      },
      set: (_t, key, value) => {
        let last = ref.current[key as any]
        ;(ref.current[key as any] as any) = value
        if (last !== value && subbed.has(key)) update()
        return true
      },
    })
  }, [])

  return value
}
