import { Redirect, useLocation, useRoute, useSearch } from 'wouter'
import { type User, signOut } from '@firebase/auth'
import { useEffect, useState } from 'react'
import { cn } from 'mcn'

import { useAuth } from '@fiar/workbench'

import { useAuthConfig, useFirebaseAuth } from '../context/index.js'
import { Login } from '../login/index.js'

export const Authorize = () => {
  const auth = useFirebaseAuth()
  const config = useAuthConfig()

  const [location, navigate] = useLocation()
  const [ready, setReady] = useState(false)
  const status = useAuth((x) => x.status)
  const match = useRoute('/login')[0]
  const search = useSearch()

  const updateUser = (current: User | null) => {
    const user = current?.displayName && current.uid ? { name: current.displayName, id: current.uid } : null
    useAuth.setState(user ? { status: 'signed-in', user: user } : { status: 'signed-out', user: null })
  }

  useEffect(() => {
    useAuth.setState({ status: 'signed-out' })
    auth.authStateReady().then(() => (updateUser(auth.currentUser), setReady(true)))
    return auth.onAuthStateChanged({
      next: (x) => updateUser(x),
      error: () => console.log('error:'),
      complete: () => console.log('complete:'),
    })
  }, [auth])

  useEffect(() => {
    if (status !== 'signed-in' || !match) return
    navigate(history.state.redirect || '/')
  }, [match, status, search])

  useEffect(() => {
    useAuth.setState({
      signin: () => navigate(`/login`, { state: { redirect: location } }),
      signout: () => signOut(auth),
    })
  }, [auth, location])

  return (
    <>
      {status !== 'signed-in' && !config.allowNoAuth && <Redirect to="/login" />}
      {match && (
        <div className={cn('bg-back', [config.allowNoAuth, 'h-full w-full', 'fixed inset-0 z-40'])}>
          <Login {...config} ready={ready} onSuccess={(x) => updateUser(x.user)} />
        </div>
      )}
    </>
  )
}
