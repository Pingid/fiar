import { useSWRConfig, Middleware, BareFetcher } from 'swr'
import { useState, useEffect } from 'react'

export const useSwrStatus = () => {
  const [error, setError] = useState<Error | string | null>(null)
  const [loading, setLoading] = useState(false)
  const swr = useSWRConfig()

  useEffect(() => {
    const listener: Middleware = (cb) => (key, fetcher, config) => {
      const onSuccess = config.onSuccess
      const onError = config.onError
      const ftch: BareFetcher<any> = (...args: any) => {
        setTimeout(() => (setLoading(getLoading()), setError(getError())), 15)
        return fetcher ? fetcher(...(args as [any])) : null
      }
      return cb(key, ftch, {
        ...config,
        onError: (err: any, key: any, config: any) => {
          setTimeout(() => (setLoading(getLoading()), setError(getError())), 15)
          return onError ? onError(err, key, config) : null
        },
        onSuccess: (err: any, key: any, config: any) => {
          setTimeout(() => (setLoading(getLoading()), setError(getError())), 15)
          return onSuccess ? onSuccess(err, key, config) : null
        },
      })
    }

    const getError = () => {
      for (let key of swr.cache.keys()) {
        const item = swr.cache.get(key)
        if (item?.error) return item?.error
      }
      return null
    }

    const getLoading = () => {
      for (let key of swr.cache.keys()) {
        if (swr.cache.get(key)?.isLoading) return true
      }
      return false
    }

    const original = swr.use
    swr.use = [...(original ?? []), listener]
    return () => {
      swr.use = original as any
    }
  }, [])

  return { loading, error }
}
