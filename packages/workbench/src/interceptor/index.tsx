import { createContext, useContext, useEffect, useRef } from 'react'

export type Interceptor = (trigger: () => void) => any
const InterceptContext = createContext<React.MutableRefObject<Interceptor>>({ current: (cb) => cb() })
export const useInterceptor = () => useContext(InterceptContext)

export const InterceptProvider = (props: {
  children: React.ReactNode
  value?: React.MutableRefObject<Interceptor>
}) => {
  const interceptor = useRef<Interceptor>((cb) => cb())
  return <InterceptContext.Provider value={props.value || interceptor}>{props.children}</InterceptContext.Provider>
}

export const useIntercept = (intercept: Interceptor) => {
  const interceptor = useInterceptor()
  const original = useRef(interceptor.current)
  useEffect(() => {
    original.current = interceptor.current
    return () => void (interceptor.current = original.current)
  }, [])
  useEffect(() => {
    interceptor.current = intercept
  }, [intercept])
}
