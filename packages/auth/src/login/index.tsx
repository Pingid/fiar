import {
  type AuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  UserCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from '@firebase/auth'
import { BsFacebook, BsGithub, BsTwitter, BsGoogle } from 'react-icons/bs'
import useMutation from 'swr/mutation'
import React from 'react'

import { Button, Field, FieldControl, Input, LoadingDots } from '@fiar/components'
import { useFirebaseAuth, useAuthConfig } from '../context/index.js'

export const Login = (props: { onSuccess: (user: UserCredential) => void; ready?: boolean }): JSX.Element => {
  const auth = useFirebaseAuth()
  const config = useAuthConfig()

  const [error, setError] = React.useState('')

  const emailPassword = config.providers.find((x) => x.providerId === 'password')
  const social = config.providers.filter((x) => x.providerId !== 'password')
  const signinEmail = useMutation(
    'auth',
    (_, p: { arg: { email: string; password: string } }) =>
      signInWithEmailAndPassword(auth, p.arg.email, p.arg.password),
    { onError: (e) => setError(e.message), onSuccess: props.onSuccess },
  )
  const signinSocial = useMutation(
    config.method ?? 'redirect',
    (type: string, p: { arg: AuthProvider }) => {
      if (type === 'redirect') return signInWithRedirect(auth, p.arg)
      return signInWithPopup(auth, p.arg)
    },
    { onError: (e) => setError(e.message), onSuccess: props.onSuccess },
  )

  const mutating = signinEmail.isMutating || signinSocial.isMutating

  if (mutating || !props.ready) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingDots />
      </div>
    )
  }

  return (
    <div className="flex !h-[100dvh] h-[100vh] w-full items-center justify-center px-6">
      <div className={'relative mx-auto w-full max-w-md border'}>
        <div className={'flex items-start justify-between gap-3 border-b px-4 py-2'}>
          <h4 className="font-medium">Login</h4>
          <p className="text-error text-sm">{error}</p>
        </div>
        {emailPassword && (
          <EmailAndPasswordForm
            loading={mutating}
            signIn={(email, password) => signinEmail.trigger({ email, password })}
          />
        )}
        <div className="space-y-3 px-4 py-6">
          {social.map((x) => {
            const selected = providertypes[x.providerId]
            return (
              <Button
                key={x.providerId}
                className="flex w-full items-center justify-center py-3"
                onClick={() => signinSocial.trigger(x)}
                disabled={mutating}
                icon={selected?.icon}
              >
                Sign in via {selected?.title || x.providerId}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const EmailAndPasswordForm = (props: { signIn: (email: string, password: string) => any; loading?: boolean }) => {
  const [password, setPassword] = React.useState('')
  const [email, setEmail] = React.useState('')

  return (
    <form className="space-y-3 px-4 py-6" onSubmit={(e) => (e.preventDefault(), props.signIn(email, password))}>
      <Field label="email" name="email">
        <FieldControl>
          <Input id="email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FieldControl>
      </Field>
      <Field label="password" name="password">
        <FieldControl>
          <Input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FieldControl>
      </Field>
      <div className="flex justify-end pt-3">
        <Button disabled={props.loading} className="px-6 py-3">
          Login
        </Button>
      </div>
    </form>
  )
}

const providertypes: Record<string, { title: string; icon: JSX.Element }> = {
  [GoogleAuthProvider.PROVIDER_ID]: { title: 'Google', icon: <BsGoogle /> },
  [TwitterAuthProvider.PROVIDER_ID]: { title: 'Twitter', icon: <BsTwitter /> },
  [GithubAuthProvider.PROVIDER_ID]: { title: 'Github', icon: <BsGithub /> },
  [FacebookAuthProvider.PROVIDER_ID]: { title: 'Facebook', icon: <BsFacebook /> },
}
