import { useEffect, useRef } from 'react'

export const useRefArg = <T>(x: T) => {
  const ref = useRef(x)
  useEffect(() => void (ref.current = x), [x])
  return ref
}
