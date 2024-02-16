import { createContext, useMemo, useContext, useEffect } from 'react'
import { Middleware, BareFetcher, SWRConfig } from 'swr'
import { useShallow } from 'zustand/react/shallow'
import { createStore, useStore } from 'zustand'

type StatusState = { loading: boolean; error: Error | string | null }
type StatusStore = StatusState & {
  online: boolean
  promise: <T>(key: string, prms: Promise<T>) => Promise<T>
  update: (key: string, status: StatusState) => void
}
const createStatusStore = () =>
  createStore<StatusStore>((set) => {
    const cache = new Map<string, StatusState>()
    const getState = () => {
      let error = null
      let loading = false

      for (let value of cache.values()) {
        if (!error && value.error) error = value.error
        if (!loading && value.loading) loading = value.loading
      }

      return { error, loading }
    }
    const update = (key: string, status: StatusState) => {
      if (status.error) setTimeout(() => update(key, { ...cache.get(key), error: null } as any), 3_000)
      cache.set(key, status)
      set(getState())
    }
    return {
      error: null,
      online: true,
      loading: false,
      update,
      promise: (key, prms) => {
        update(key, { loading: true, error: null })
        return prms
          .then((x) => {
            update(key, { loading: false, error: null })
            return x
          })
          .catch((error) => {
            update(key, { loading: false, error })
            return Promise.reject(error)
          })
      },
    }
  })

const StatusStoreContext = createContext(createStatusStore())
export const useStatusStore = () => useContext(StatusStoreContext)
export const useStatus: <U>(selector: (state: StatusStore) => U) => U = (cb) =>
  useStore(useStatusStore(), useShallow(cb))

export const StatusProvider = (p: { children: React.ReactNode }) => {
  const config = useMemo(() => {
    const store = createStatusStore()
    return { config: { use: [createSwrStatusListener(store)] }, store }
  }, [])

  useEffect(() => {
    config.store.setState({ online: window.navigator.onLine })
    const [on, off] = [() => config.store.setState({ online: true }), () => config.store.setState({ online: false })]
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [config.store])

  return (
    <SWRConfig value={config.config}>
      <StatusStoreContext.Provider value={config.store}>{p.children}</StatusStoreContext.Provider>
    </SWRConfig>
  )
}

const createSwrStatusListener =
  (store: ReturnType<typeof createStatusStore>): Middleware =>
  (cb) =>
  (key, fetcher, config) => {
    const ftch: BareFetcher<any> = (key, ftcher, options) => {
      if (!fetcher) return null
      return store.getState().promise(key, Promise.resolve(fetcher(key, ftcher, options)))
    }
    return cb(key, ftch, config)
  }
