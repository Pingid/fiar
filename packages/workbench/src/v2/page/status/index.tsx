import { createContext, useMemo, useContext, useEffect, useCallback } from 'react'
import { Middleware, BareFetcher, SWRConfig } from 'swr'
import { createStore, useStore } from 'zustand'
import { cn } from 'mcn'

import { ErrorMessage, LoadingDots } from '@fiar/components'
import { useShallow } from 'zustand/react/shallow'

export const PageStatusBar = (p: { children?: React.ReactNode }) => {
  const store = usePageStatusStore()
  const loading = useStore(store, (x) => x.loading)
  const error = useStore(store, (x) => x.error)

  return (
    <div
      className={cn(
        'w-full max-w-full px-4 py-1 transition-[padding,height]',

        'grid items-end [grid-template-columns:min-content_1fr_max-content]',
      )}
    >
      <p className={cn('transition-width overflow-hidden whitespace-nowrap delay-300', [loading, 'w-7', 'w-0'])}>
        <LoadingDots />
      </p>
      <div className="text-error grid max-w-full pr-2 text-sm leading-snug">
        {error && <ErrorMessage>{error as any}</ErrorMessage>}
      </div>
      {p.children}
    </div>
  )
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
