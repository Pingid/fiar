import { AuthConfig, useAuthConfig } from './context/index.js'
import { Authorize } from './authorize/index.js'
import { useLayoutEffect } from 'react'

export type { AuthConfig } from './context/index.js'

export const Auth = (props: AuthConfig) => {
  useLayoutEffect(() => useAuthConfig.setState(props), [props])
  if (!useAuthConfig.getState().app) useAuthConfig.setState(props)
  return <Authorize />
}
