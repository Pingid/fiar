import { useEffect } from 'react'

import { useProxyState } from './useProxyState'
import { useRefArg } from './useRefArg'

export const useAsync = <A, P extends { disabled?: boolean; deps?: any[]; extra?: Record<string, any> }>(
  handler: () => Promise<A>,
  options?: P,
): {
  loading: boolean
  data: A | undefined
  error: any
  refetch: () => Promise<any>
} & P['extra'] => {
  const args = useRefArg({ ...options, handler })
  const value = useProxyState(
    { loading: false, data: undefined as A | undefined, error: undefined as any, ...options?.extra },
    {
      refetch: () => {
        if (value.loading) return Promise.resolve()
        value.loading = true
        return args.current
          .handler()
          .then((x) => (value.data = x))
          .catch((x) => (value.error = x))
          .finally(() => (value.loading = false))
      },
    },
  )

  const deps = options?.deps || []
  useEffect(() => void (!options?.disabled && value.refetch()), [options?.disabled, ...deps])

  return value
}
