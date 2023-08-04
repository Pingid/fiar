import {
  AuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  UserCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from '@firebase/auth'
import React from 'react'

import { BsFacebook, BsGithub, BsTwitter, BsGoogle } from 'react-icons/bs'
import { Button, Control, Input } from '@fiar/components'
import useMutation from 'swr/mutation'

import { component } from '@fiar/workbench/context'
import { useAuthConfig } from '../../context'

export const AuthLogin = component(
  'auth:login',
  ({ onSuccess }: { onSuccess: (user: UserCredential) => void }): JSX.Element => {
    const [password, setPassword] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [error, setError] = React.useState('')

    const config = useAuthConfig()

    const emailPassword = config.providers.find((x) => x.providerId === 'password')
    const social = config.providers.filter((x) => x.providerId !== 'password')
    const signinEmail = useMutation('auth', () => signInWithEmailAndPassword(config.auth, email, password), {
      onError: (e) => setError(e.message),
      onSuccess,
    })
    const signinSocial = useMutation(
      'auth',
      (_, p: { arg: AuthProvider }) =>
        config.signin === 'popup' ? signInWithPopup(config.auth, p.arg) : signInWithRedirect(config.auth, p.arg),
      {
        onError: (e) => setError(e.message),
        onSuccess,
      },
    )
    const mutating = signinEmail.isMutating || signinSocial.isMutating
    return (
      <div className="flex !h-[100dvh] h-[100vh] w-full items-center justify-center px-6">
        <div className={'relative mx-auto w-full max-w-md rounded-md border'}>
          <div className={'flex items-start justify-between gap-3 border-b px-4 py-2'}>
            <h4 className="font-medium">Login</h4>
            <p className="text-error text-sm">{error}</p>
          </div>
          {emailPassword && (
            <form className="space-y-3 px-4 py-6" onSubmit={(e) => (e.preventDefault(), signinEmail.trigger())}>
              <Control label="email" name="email">
                <Input id="email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Control>
              <Control label="password" name="password">
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Control>
              <div className="flex justify-end pt-3">
                <Button variant="outline" size="lg" disabled={mutating}>
                  Login
                </Button>
              </div>
            </form>
          )}
          <div className="space-y-3 px-4 py-6">
            {social.map((x) => {
              const selected = providertypes[x.providerId]
              return (
                <Button
                  key={x.providerId}
                  variant="outline"
                  size="lg"
                  className="flex w-full items-center justify-center"
                  onClick={() => signinSocial.trigger(x)}
                  disabled={mutating}
                >
                  {selected?.icon && <div className="mr-2 h-6 w-6">{selected?.icon}</div>} Sign in via{' '}
                  {selected?.title || x.providerId}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    )
  },
)

const providertypes: Record<string, { title: string; icon: JSX.Element }> = {
  [GoogleAuthProvider.PROVIDER_ID]: { title: 'Google', icon: <BsGoogle className="h-full w-full" /> },
  [TwitterAuthProvider.PROVIDER_ID]: { title: 'Twitter', icon: <BsTwitter className="h-full w-full" /> },
  [GithubAuthProvider.PROVIDER_ID]: { title: 'Github', icon: <BsGithub className="h-full w-full" /> },
  [FacebookAuthProvider.PROVIDER_ID]: { title: 'Facebook', icon: <BsFacebook className="h-full w-full" /> },
}
