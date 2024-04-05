import React, { createContext, useContext, useState } from 'react'
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { createGlobalSlot } from '@fiar/components'
import { Link, useRoute } from 'wouter'
import { cn } from 'mcn'

import { useAuth } from '../auth/index.js'

const NavActionTopSlot = createGlobalSlot()
const NavStateContext = createContext([false, (_open: boolean): void => {}] as const)

export const useNavState = () => useContext(NavStateContext)

export const Nav = ({ children }: { children: React.ReactNode }) => {
  const state = useState(false)
  const [open, setOpen] = state

  return (
    <NavStateContext.Provider value={state as any}>
      <div
        className={cn(
          'grid h-full w-full transition-[grid] [grid-template:var(--asside-height)_1fr_/_1fr] sm:[grid-template:1fr_/_var(--asside-width)_1fr]',
          [open, '[--asside-width:12rem]', '[--asside-width:3rem]'],
        )}
      >
        <aside
          className={cn(
            'bg-back sticky top-0 z-40 w-full sm:h-[--container-height]',
            'sm:grid sm:[grid-template:max-content_1fr/1fr]',
            'border-b sm:border-b-0 sm:border-r',
          )}
        >
          <div className="flex h-12 w-full min-w-0 flex-row-reverse items-center px-3 [justify-content:start] sm:flex-row sm:justify-between">
            <h2 className={cn('overflow-clip', [open, 'w-auto', 'sm:w-0'])}>Fiar</h2>
            <button onClick={() => setOpen(!open)} className="relative shrink-0 pr-3 sm:pr-0 ">
              <ChevronDownIcon
                className={cn('sm:rotate-270  h-6 w-6 transition-transform sm:block', [
                  open,
                  'rotate-180 sm:rotate-90',
                ])}
              />
            </button>
          </div>
          <div
            className={cn('bg-back flex h-max w-full min-w-0 flex-col justify-between py-3 sm:h-full sm:py-6', [
              open,
              'flex border-b sm:border-b-0',
              'hidden sm:flex',
            ])}
          >
            <ul className="w-full space-y-4 p-3">
              <NavActionTopSlot.Locate use="li" className="w-full" />
            </ul>
            <ul className="w-full space-y-4 p-3">
              <AuthButton />
            </ul>
          </div>
        </aside>

        <div
          className={cn('bg-back/90 fixed left-0 top-0 z-30 h-screen w-screen sm:hidden', [open, 'block', 'hidden'])}
          onClick={() => setOpen(false)}
        />
        {children}
      </div>
    </NavStateContext.Provider>
  )
}

export const NavActionTop = (p: { children: React.ReactElement }) => (
  <NavActionTopSlot.Place>{p.children}</NavActionTopSlot.Place>
)

export const NavButton = (props: { title: React.ReactNode; icon: React.ReactNode; active?: boolean }) => {
  return (
    <div className={cn('flex w-full leading-none', [props.active, 'text-front', 'text-front/70 hover:text-front/80'])}>
      <span className="relative -top-1.5 mr-3 inline [&>*]:inline [&>*]:h-6 [&>*]:w-6">{props.icon}</span>
      <span className="truncate">{props.title}</span>
    </div>
  )
}

export const AppLink = (props: { to: string; title: React.ReactNode; icon: React.ReactNode }) => {
  const [_, setOpen] = useNavState()
  const [m2] = useRoute(`${props.to}/*`)
  const [m1] = useRoute(props.to)
  return (
    <NavActionTopSlot.Place>
      <Link to={props.to} onClick={() => (window.innerWidth < 640 ? setOpen(false) : null)} className="w-full">
        <NavButton {...props} active={m1 || m2} />
      </Link>
    </NavActionTopSlot.Place>
  )
}

const AuthButton = () => {
  const auth = useAuth()
  if (auth.status === 'disabled') return null

  return (
    <>
      <p
        className={cn('truncate pb-3 text-sm font-medium leading-none transition-opacity', [
          !open,
          'opacity-0',
          'opacity-100',
        ])}
      >
        {auth.status === 'signed-in' && auth.user?.displayName}
      </p>
      {auth.status === 'signed-in' && (
        <button className="w-full" onClick={() => auth.signout()}>
          <NavButton icon={<ArrowLeftStartOnRectangleIcon />} title="Sign out" />
        </button>
      )}
      {auth.status === 'signed-out' && (
        <button className="w-full" onClick={() => auth.signin()}>
          <NavButton icon={<ArrowRightEndOnRectangleIcon />} title="Sign in" />
        </button>
      )}
    </>
  )
}
