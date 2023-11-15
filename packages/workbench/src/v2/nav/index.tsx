import React, { createContext, useContext, useState } from 'react'
import { Link, useRoute } from 'wouter'
import { cn } from 'mcn'

import { createGlobalSlot } from '@fiar/components'

const NavActionTop = createGlobalSlot()
const NavActionBottom = createGlobalSlot()
const NavOpenContext = createContext(false)
export const useNavOpen = () => useContext(NavOpenContext)

export const Nav = ({ children }: { children: React.ReactNode }) => {
  const [open, setopen] = useState(false)

  const text = cn('truncate transition-all', [open, 'opacity-100 max-w-full', 'opacity-0 max-w-0 pointer-events-none'])

  return (
    <NavActionTop.Provider>
      <NavOpenContext.Provider value={open}>
        {/* Spacer */}
        <div className={cn('relative -z-10 transition-[width]', [open, 'w-12 sm:w-52', 'w-12 sm:w-16'])} />
        {/* Nav menu */}
        <div
          className={cn(
            'bg-back fixed top-0 z-40 flex h-full flex-shrink-0 flex-col justify-between border-r transition-[width]',
            [open, 'w-40 sm:w-52', 'w-12 sm:w-16'],
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-5">
            <Link to="/" onClick={() => setopen(true)}>
              <a className={cn('text-xl font-medium', text)}>fiar</a>
            </Link>
            <button onClick={() => setopen(!open)} tabIndex={0}>
              <Arrow className={cn('h-6 w-6 transition-transform', [open, 'rotate-180'])} />
            </button>
          </div>
          {/* Page links */}

          <ul className="mt-6 h-full w-full space-y-1 px-1 sm:px-3">
            <NavActionTop.Locate use="li" className="w-full" />
          </ul>
          <ul className="w-full space-y-1 px-1 pb-8 sm:px-3">
            <NavActionBottom.Locate use="li" className="w-full" />
          </ul>
        </div>
        {/* Children */}
        <div className={cn('relative min-h-full w-full flex-1', [open, 'blur-sm sm:blur-0', 'blur-0'])}>
          {/* Mobile overlay */}
          <div
            onClick={() => setopen(false)}
            className={cn('bg-front absolute inset-0 transition-opacity sm:hidden', [
              open,
              'z-30 opacity-5',
              'pointer-events-none -z-10 opacity-0',
            ])}
          />
          {children}
        </div>
      </NavOpenContext.Provider>
    </NavActionTop.Provider>
  )
}

export const ActionTop = (p: { children: React.ReactNode }) => <NavActionTop.Place>{p.children}</NavActionTop.Place>
export const ActionBottom = (p: { children: React.ReactNode }) => (
  <NavActionBottom.Place>{p.children}</NavActionBottom.Place>
)

export const AppLink = (props: { to: string; title: React.ReactNode; icon: React.ReactNode }) => {
  const [m1] = useRoute(props.to)
  const [m2] = useRoute(`${props.to}/*`)
  const open = useNavOpen()
  const match = m1 || m2

  const text = cn('truncate transition-all', [open, 'opacity-100 max-w-full', 'opacity-0 max-w-0 pointer-events-none'])
  const btn = cn('w-full flex items-center px-2 gap-4 rounded-sm py-2', [!!match, 'bg-front/10', 'hover:bg-front/5'])

  return (
    <ActionTop>
      <Link to={props.to}>
        <a className="w-full">
          <div className={btn}>
            <span className="inline-block h-5 w-5 shrink-0 text-2xl uppercase [&>*]:h-full [&>*]:w-full">
              {props.icon}
            </span>
            <p className={cn('flex-1 text-left', text)}>{props.title}</p>
          </div>
        </a>
      </Link>
    </ActionTop>
  )
}

const Arrow = (p: JSX.IntrinsicElements['svg']) => (
  <svg
    {...p}
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height="1.5rem"
    width="1.5rem"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
  </svg>
)
