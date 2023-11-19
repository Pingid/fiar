import { useEffect, useState } from 'react'
import { type User } from '@firebase/auth'
import { useLocation } from 'wouter'

import { LoadingDots } from '@fiar/components'

import { FirebaseAuthProvider, AuthUserProvider, AuthConfig } from '../context/index.js'
import { UserAuthState } from '../button/index.js'
import { Login } from '../login/index.js'

export const Authorize = (props: { children: React.ReactNode } & AuthConfig) => {
  const [location, setLocation] = useLocation()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User>()
  const match = /^\/login/.test(location)

  const updateUser = () => props.auth.currentUser && setUser(props.auth.currentUser)

  useEffect(() => {
    props.auth.authStateReady().then(() => (updateUser(), setLoading(false)))
    return props.auth.onAuthStateChanged({
      next: (x) => setUser(x ?? undefined),
      error: () => console.log('error:'),
      complete: () => console.log('complete:'),
    })
  }, [props.auth])

  useEffect(() => {
    if (match || props.allowNoAuth || user || loading) return
    setLocation(`/login?redirect=${location}`, { replace: true })
  }, [match, location, props.allowNoAuth, user, loading])

  useEffect(() => {
    if (!user || loading || !match) return
    const redirect = new URLSearchParams(window.location.search).get('redirect')
    setLocation(redirect || '/')
  }, [user, match, loading, location])

  if (!user && loading && !props.allowNoAuth) {
    return (
      <FirebaseAuthProvider value={props.auth}>
        <div className="flex h-screen w-full items-center justify-center">
          <LoadingDots />
        </div>
      </FirebaseAuthProvider>
    )
  }

  return (
    <FirebaseAuthProvider value={props.auth}>
      <AuthUserProvider value={user ?? null}>
        <UserAuthState />
        {match ? <Login {...props} onSuccess={(x) => setUser(x.user)} /> : props.children}
      </AuthUserProvider>
    </FirebaseAuthProvider>
  )
}
