import { useCallback, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from '@firebase/auth'

import { component, useFiarAppState, useFiarAppStore } from '@fiar/workbench'
import { LoadingDots } from '@fiar/ui'

import { useAuthConfig } from '../../context'
import { AuthLogin } from '../auth-login'

export const AuthAuthorise = component('auth:authorize', (p: { children: React.ReactNode }): JSX.Element => {
  const config = useAuthConfig()
  const user = useFiarAppState((x) => x.user)
  const store = useFiarAppStore()
  const [loading, setLoading] = useState(true)

  const setUser = useCallback(
    (user: User) => store.setState({ user: { ...user, displayName: user.displayName ?? '', email: user.email ?? '' } }),
    [],
  )

  useEffect(() => {
    if (config.auth.currentUser) setUser(config.auth.currentUser)
    return onAuthStateChanged(config.auth, (x) => (x ? setUser(x) : null))
  }, [config, setUser])

  useEffect(() => void config.auth.authStateReady().then(() => setLoading(false)), [])

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
