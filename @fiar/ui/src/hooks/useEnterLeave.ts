import { useCallback, useEffect, useMemo, useRef } from 'react'

type Hook = (number | string)[]
export const useEnterLeave = (props: { enter: Hook; leave?: Hook; enabled?: boolean }) => {
  const ref = useRef<HTMLElement>()
  const mounted = useRef(true)
  const original = useRef<string>()
  const entering = useRef(true)

  let deps = [...props.enter, ...(props.leave || []), props.enabled]

  const resolve = ([head, ...tail]: Hook, _entering: boolean): Promise<any> => {
    if (entering.current !== _entering) return Promise.resolve()
    if (typeof head === 'undefined') return Promise.resolve()
    if (typeof head === 'number') {
      return new Promise<void>((res) => setTimeout(() => res(), head)).then(() => resolve(tail, _entering))
    }
    if (!ref.current || !mounted.current) return Promise.resolve()
    ref.current.className = original.current + head
    return resolve(tail, _entering)
  }

  const onEnter = useCallback(() => {
    entering.current = true
    resolve(props.enter, true)
  }, deps)

  const onLeave = useCallback(() => {
    entering.current = false
    return resolve(props.leave || [], false)
  }, deps)

  useEffect(() => {
    mounted.current = true
    entering.current = true
    return () => {
      entering.current = false
      if (ref.current) ref.current.className = original.current || ''
      void (mounted.current = false)
    }
  }, [])

  useEffect(() => {
    if (props.enabled === false) return
    onEnter()
  }, [onEnter])

  return useMemo(
    () => ({
      ref: <H extends HTMLElement>(x: H | null) => {
        ;(ref.current as any) = x
        if (!ref.current) return
        original.current = ref.current.className.trim() + ' '
        if (typeof props.enter[0] === 'string') ref.current.className = original.current + props.enter[0]
      },
      leave: onLeave,
      enter: onEnter,
    }),
    deps,
  )
}
