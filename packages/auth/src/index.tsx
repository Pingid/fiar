import { useLayoutEffect } from 'react'

import { AuthConfig, useAuthConfig } from './context/index.js'
import { Authorize } from './components/index.js'

export type { AuthConfig } from './context/index.js'

export const Auth = (props: AuthConfig) => {
  useLayoutEffect(() => useAuthConfig.setState(props), [props])
  if (!useAuthConfig.getState().app) useAuthConfig.setState(props)
  return <Authorize />
}
