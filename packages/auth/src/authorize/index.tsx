import { Redirect, Route, useLocation, useRoute, useSearch } from 'wouter'
import { type User, signOut } from '@firebase/auth'
import { useEffect, useState } from 'react'
import { cn } from 'mcn'

import { useAuth } from '@fiar/workbench'

import { AuthConfig } from '../context/index.js'
import { Login } from '../login/index.js'

export const Authorize = (props: AuthConfig) => {
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
    props.auth.authStateReady().then(() => (updateUser(props.auth.currentUser), setReady(true)))
    return props.auth.onAuthStateChanged({
      next: (x) => updateUser(x),
      error: () => console.log('error:'),
      complete: () => console.log('complete:'),
    })
  }, [props.auth])

  useEffect(() => {
    if (status !== 'signed-in' || !match) return
    const redirect = new URLSearchParams(search).get('redirect') || '/'
    nav(redirect || '/')
  }, [match, status, search])

  useEffect(() => {
    useAuth.setState({
      status: 'signed-out',
      signin: () => nav(`/login?redirect=${location}`),
      signout: () => signOut(props.auth),
    })
  }, [])

  return (
    <>
      {status !== 'signed-in' && !props.allowNoAuth && <Redirect to="/login" />}
      <Route path="/login">
        <div className={cn('bg-back', [props.allowNoAuth, 'h-full w-full', 'fixed inset-0 z-40'])}>
          <Login {...props} ready={ready} onSuccess={(x) => updateUser(x.user)} />
        </div>
      </Route>
    </>
  )
}
