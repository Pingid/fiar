import { ReactNode, useState, useCallback, createContext, useContext, useRef, useEffect } from 'react'
import { Router, RouterProps, Path } from 'wouter'

type NavFunc = (to: Path, options?: { replace?: boolean }) => void
const MemoryLocationCtx = createContext<Path>('/')
export const MemoryNavigationContext = createContext((path: string): string | null => path)
export const MemoryNavigationProvider = (p: {
  children: React.ReactNode
  value?: ((path: string) => string | null) | undefined
}) => {
  const value = useRef(p.value || ((x: string) => x))
  useEffect(() => void (p.value && (value.current = p.value)), [p.value])
  return (
    <MemoryNavigationContext.Provider value={useCallback((x) => value.current(x), [])}>
      {p.children}
    </MemoryNavigationContext.Provider>
  )
}
export const useMemoryHook = (path: Path[] = ['/'], { maxHistory = 100 } = {}) => {
  const [history, setHistory] = useState<Path[]>(path)
  const nav = useContext(MemoryNavigationContext)

  let useLocationHook: { (): [Path, NavFunc]; history?: any }
  const navigate: NavFunc = useCallback(
    (to: Path, { replace }: { replace?: boolean } = {}) => {
      const result = nav(to)
      if (result === null) return
      setHistory((history) => {
        const nextHistory = history.slice(0, maxHistory)
        if (replace) nextHistory.pop()
        nextHistory.push(result)
        return nextHistory
      })
    },
    [maxHistory],
  )

  useLocationHook = () => {
    const location = useContext(MemoryLocationCtx)
    return [location, navigate]
  }
  useLocationHook.history = history

  return useLocationHook
}
interface InMemoryRouterProps extends Partial<Omit<RouterProps, 'hook'>> {
  children: ReactNode
  initialPath?: Path | Path[]
}

export function MemoryRouter({ initialPath, ...props }: InMemoryRouterProps) {
  const inMemHook = useMemoryHook(typeof initialPath === 'string' ? [initialPath] : initialPath)
  const location = inMemHook.history.slice(-1).pop()

  return (
    <MemoryLocationCtx.Provider value={location}>
      <Router hook={inMemHook} {...props} />
    </MemoryLocationCtx.Provider>
  )
}
