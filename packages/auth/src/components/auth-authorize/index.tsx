import { useCallback, useEffect, useState } from 'react'
import { User, onAuthStateChanged, setPersistence, browserSessionPersistence } from '@firebase/auth'

import { component, useFiarAppState, useFiarAppStore } from '@fiar/workbench'
import { LoadingDots } from '@fiar/components'

import { useAuthConfig } from '../../context/index.js'
import { AuthLogin } from '../auth-login/index.js'

export const AuthAuthorise = component('auth:authorize', (p: { children: React.ReactNode }): JSX.Element => {
  const config = useAuthConfig()
  const user = useFiarAppState((x) => x.components.auth?.user)
  const store = useFiarAppStore()
  const [loading, setLoading] = useState(true)

  const setUser = useCallback(
    (user: User) =>
      store.setState((x) => ({
        components: {
          ...x.components,
          auth: {
            user: { ...user, displayName: user.displayName ?? '', email: user.email ?? '' },
            signout: () => {
              store.setState((x) => ({ components: { ...x.components, auth: null } }))
              return config.auth.signOut()
            },
          },
        },
      })),
    [],
  )

  useEffect(() => {
    setPersistence(config.auth, browserSessionPersistence)
    config.auth.authStateReady().then(() => {
      setLoading(false)
      config.auth.currentUser && setUser(config.auth.currentUser)
    })
    return onAuthStateChanged(config.auth, (x) => (x ? setUser(x) : null))
  }, [config, setUser])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingDots />
      </div>
    )
  }

  if (user) return <>{p.children}</>

  return <AuthLogin onSuccess={(x) => setUser(x.user)} />
})
