import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { BaseLocationHook, Router, useRouter } from 'wouter'

type NavigationHook = (trigger: () => void, path: string) => any
const NavigationContext = createContext<React.MutableRefObject<NavigationHook>>({ current: (x) => x })
export const useIntercept = (intercept: NavigationHook) => {
  const value = useContext(NavigationContext)
  const original = useRef(value.current)
  useEffect(() => {
    original.current = value.current
    return () => void (value.current = original.current)
  }, [])
  useEffect(() => void (value.current = intercept), [intercept])
}

export const InterceptProvider = (props: { children: React.ReactNode }) => {
  const intercept = useRef<NavigationHook>((cb) => cb())
  const router = useRouter()
  const hook = useCallback<BaseLocationHook>(
    (arg: any) => {
      const [location, navigate] = router.hook(arg)
      const shadowed = (path: string, ...args: any[]) => intercept.current(() => navigate(path, ...args), path)
      return [location, shadowed]
    },
    [router.hook],
  )

  return (
    <NavigationContext.Provider value={intercept}>
      <Router base={router.base} hook={hook}>
        {props.children}
      </Router>
    </NavigationContext.Provider>
  )
}
