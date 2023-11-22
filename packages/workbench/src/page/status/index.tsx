import { createContext, useMemo, useContext, useEffect, useCallback, useState, useRef } from 'react'
import { Middleware, BareFetcher, SWRConfig } from 'swr'
import { useShallow } from 'zustand/react/shallow'
import { createStore, useStore } from 'zustand'
import { cn } from 'mcn'

import { ErrorMessage, LoadingDots } from '@fiar/components'

export const PageStatusBar = () => {
  const store = usePageStatusStore()
  const loading = useStore(store, (x) => x.loading)
  const error = useStore(store, (x) => x.error)
  const loadingLonger = useLastLonger(loading, loading, 500)
  return (
    <div className={cn('flex transition-all', [!!(loadingLonger || error), 'px-4 pb-2'])}>
      <p className={cn('transition-width overflow-hidden whitespace-nowrap', [loadingLonger, 'h-6 w-7', 'h-0 w-0'])}>
        <LoadingDots />
      </p>
      {error && <ErrorMessage>{error as any}</ErrorMessage>}
    </div>
  )
}

const useLastLonger = <T extends any>(x: T, active: boolean, delay: number) => {
  const [result, setResult] = useState(x)
  const value = useRef(x)
  value.current = x
  useEffect(() => {
    if (!active) return setResult(value.current)
    let timeout = setTimeout(() => setResult(value.current), delay)
    return () => clearTimeout(timeout)
  }, [active, delay])
  return result
}

type StatusState = { loading: boolean; error: Error | null }
const createStatusStore = () =>
  createStore<StatusState & { update: (key: string, status: StatusState) => void }>((set) => {
    const cache = new Map<string, StatusState>()
    const getState = () => {
      let error = null
      let loading = false

      for (let value of cache.values()) {
        if (value.error) error = value.error
        if (value.loading) loading = value.loading
      }

      return { error, loading }
    }
    return {
      error: null,
      loading: false,
      update: (key: string, status: StatusState) => {
        cache.set(key, status)
        set(getState())
      },
    }
  })

const StatusContext = createContext(createStatusStore())
export const usePageStatusStore = () => useContext(StatusContext)

export const useSetPageStatus = (key: string, status: StatusState) => {
  const store = usePageStatusStore()
  useEffect(() => {
    store.getState().update(key, status)
  }, [key, status.error, status.loading])
}

export const usePageStatus = () =>
  useStore(
    usePageStatusStore(),
    useShallow((x) => x),
  )

export const usePageStatusAsyncHandler = (key: string) => {
  const store = usePageStatusStore()
  return useCallback(
    <T extends any>(x: Promise<T>): Promise<T> => {
      store.getState().update(key, { loading: true, error: null })
      return x
        .then((r) => {
          store.getState().update(key, { loading: false, error: null })
          return r
        })
        .catch((error) => {
          store.getState().update(key, { loading: false, error })
          return Promise.reject(error)
        })
    },
    [store],
  )
}

export const PageStatusProvider = (p: { children: React.ReactNode; error?: Error; loading?: boolean }) => {
  const config = useMemo(() => {
    const store = createStatusStore()
    return { config: { use: [createSwrStatusListener(store)] }, store }
  }, [])

  useEffect(() => {}, [p.error, p.loading])

  return (
    <SWRConfig value={config.config}>
      <StatusContext.Provider value={config.store}>{p.children}</StatusContext.Provider>
    </SWRConfig>
  )
}

const createSwrStatusListener = (store: ReturnType<typeof createStatusStore>) => {
  const listener: Middleware = (cb) => (key, fetcher, config) => {
    const ftch: BareFetcher<any> = (key, ftcher, options) => {
      if (!fetcher) return null
      store.getState().update(key, { loading: true, error: null })
      return Promise.resolve(fetcher(key, ftcher, options))
        .then((x) => {
          store.getState().update(key, { loading: false, error: null })
          return x
        })
        .catch((error) => {
          store.getState().update(key, { loading: false, error })
          return Promise.reject(error)
        })
    }
    return cb(key, ftch, config)
  }

  return listener
}
