import { ReactNode, useState, useCallback, createContext, useContext, useRef, useEffect } from 'react'
import { Router, RouterProps, Path } from 'wouter'

/**
 * This file provides a memory-based routing solution for React applications.
 * It exports a set of hooks and components to manage navigation and routing state in memory.
 * It uses the 'wouter' library for routing and React's context for state management.
 */

type NavFunc = (to: Path, options?: { replace?: boolean }) => void

// Create context for memory location
const MemoryLocationCtx = createContext<Path>('/')
export const MemoryNavigationContext = createContext((path: string): string | null => path)

/**
 * Provider component for memory navigation context.
 *
 * @param {Object} p - Props for the provider.
 * @param {React.ReactNode} p.children - Child components.
 * @param {Function} [p.value] - Function to transform the path.
 */
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

/**
 * Hook to manage memory-based navigation.
 *
 * @param {Path[]} [path=['/']] - Initial path(s).
 * @param {Object} [options={}] - Options for the hook.
 * @param {number} [options.maxHistory=100] - Maximum history entries to keep in memory.
 * @returns {Function} - Hook function with a 'history' property.
 */
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

/**
 * In-memory router component.
 *
 * @param {Object} props - Props for the router.
 * @param {ReactNode} props.children - Child components.
 * @param {Path|Path[]} [props.initialPath] - Initial path(s).
 */
export function MemoryRouter({ initialPath, ...props }: InMemoryRouterProps) {
  const inMemHook = useMemoryHook(typeof initialPath === 'string' ? [initialPath] : initialPath)
  const location = inMemHook.history.slice(-1).pop()

  return (
    <MemoryLocationCtx.Provider value={location}>
      <Router hook={inMemHook} {...props} />
    </MemoryLocationCtx.Provider>
  )
}
