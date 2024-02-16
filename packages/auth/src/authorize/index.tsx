import { Redirect, Route, useLocation, useRoute, useSearch } from 'wouter'
import { type User, signOut } from '@firebase/auth'
import { useEffect, useState } from 'react'
import { cn } from 'mcn'

import { useAuth } from '@fiar/workbench'

import { useAuthConfig, useFirebaseAuth } from '../context/index.js'
import { Login } from '../login/index.js'

export const Authorize = () => {
  const auth = useFirebaseAuth()
  const config = useAuthConfig()

  const [ready, setReady] = useState(false)
  const status = useAuth((x) => x.status)
  const match = useRoute('/login')[0]
  const [_, nav] = useLocation()
  const search = useSearch()

  const updateUser = (current: User | null) => {
    const user = current?.displayName && current.uid ? { name: current.displayName, id: current.uid } : null
    useAuth.setState(user ? { status: 'signed-in', user: user } : { status: 'signed-out', user: null })
  }

  useEffect(() => {
    auth.authStateReady().then(() => (updateUser(auth.currentUser), setReady(true)))
    return auth.onAuthStateChanged({
      next: (x) => updateUser(x),
      error: () => console.log('error:'),
      complete: () => console.log('complete:'),
    })
  }, [auth])

  useEffect(() => {
    if (status !== 'signed-in' || !match) return
    const redirect = new URLSearchParams(search).get('redirect') || '/'
    nav(redirect || '/')
  }, [match, status, search])

  useEffect(() => {
    useAuth.setState({
      status: 'signed-out',
      signin: () => nav(`/login?redirect=${location}`),
      signout: () => signOut(auth),
    })
  }, [auth])

  return (
    <>
      {status !== 'signed-in' && !config.allowNoAuth && <Redirect to="/login" />}
      <Route path="/login">
        <div className={cn('bg-back', [config.allowNoAuth, 'h-full w-full', 'fixed inset-0 z-40'])}>
          <Login {...config} ready={ready} onSuccess={(x) => updateUser(x.user)} />
        </div>
      </Route>
    </>
  )
}
