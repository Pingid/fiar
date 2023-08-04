import { IoIosArrowForward } from 'react-icons/io'
import { Link, useMatch } from 'react-router-dom'
import { useEffect, useState } from 'react'
import cn from 'mcn'

import { Avatar } from '@fiar/ui'

import { useFiarAppState } from '../../context'

export const NavPanel = (): JSX.Element => {
  const [open, setopen] = useState(true)
  const pages = useFiarAppState((x) => x.pages || [])

  const isPage = useMatch({ path: '/:page', end: false })
  const text = cn('truncate transition-all', [open, 'opacity-100 max-w-full', 'opacity-0 max-w-0 pointer-events-none'])
  useEffect(() => void (isPage ? setopen(false) : null), [])

  return (
    <div>
      <div className={cn('transition-[width]', [open, 'w-40 sm:w-52', 'w-12 sm:w-16'])} />
      <div
        className={cn('fixed top-0 flex h-full flex-shrink-0 flex-col justify-between border-r transition-[width]', [
          open,
          'w-40 sm:w-52',
          'w-12 sm:w-16',
        ])}
      >
        <div className="flex items-center justify-between p-3 sm:p-5">
          <Link to="/" onClick={() => setopen(true)}>
            <h1 className={cn('text-xl font-medium', text)}>fiar</h1>
          </Link>
          <button onClick={() => setopen(!open)}>
            <IoIosArrowForward className={cn('h-6 w-6 transition-transform', [open, 'rotate-180'])} />
          </button>
        </div>
        <ul className="mt-6 h-full w-full space-y-1 px-1 sm:px-3">
          {pages
            .filter((x) => !!x.title)
            .map((y, i) => (
              <NavPanelButton
                key={`${y.path || y.title || i}`}
                to={y.path || y.title?.toLocaleLowerCase() || ''}
                onClick={() => setopen(false)}
                icon={y.icon}
                open={open}
              >
                {y.title || ''}
              </NavPanelButton>
            ))}
        </ul>
        <div className="pb-8">
          <AuthUser open={open} />
        </div>
      </div>
    </div>
  )
}

const AuthUser = (p: { open: boolean }): JSX.Element | null => {
  const user = useFiarAppState((x) => x.user)
  const signout = useFiarAppState((x) => x.signout)

  const text = cn('truncate transition-all', [
    p.open,
    'opacity-100 max-w-full',
    'opacity-0 max-w-0 pointer-events-none',
  ])

  if (!user || !signout) return null

  return (
    <div className="sm:px-2">
      <div className="sounded-sm group relative z-50 flex w-full items-end gap-3 px-2 py-2">
        <Avatar {...user} />
        <p className={cn('flex-1 text-left', text)}>{user.displayName}</p>
        <div className="bg-back absolute bottom-1 flex hidden w-[max(80%,9rem)] flex-col space-y-1 rounded-sm border p-2 py-3 shadow-sm hover:flex group-hover:flex">
          <button className="hover:bg-front/10 w-full rounded-sm px-3 py-1 text-left" onClick={() => signout()}>
            Logout
          </button>
          <button className="hover:bg-front/10 w-full rounded-sm px-3 py-1 text-left">Dark Mode</button>
        </div>
      </div>
    </div>
  )
}

const NavPanelButton = (p: {
  children?: string
  to: string
  icon?: React.ReactNode
  open?: boolean
  onClick?: () => void
  submenu?: { title: string }[]
}) => {
  const match = useMatch({ path: p.to, end: false })
  const text = cn('truncate transition-all', [
    p.open,
    'opacity-100 max-w-full',
    'opacity-0 max-w-0 pointer-events-none',
  ])
  const btn = cn('w-full flex items-center px-2 gap-4 rounded-sm py-2', [!!match, 'bg-front/10', 'hover:bg-front/5'])

  if (!p.icon) {
    return (
      <li className="w-full">
        <Link to={p.to} onClick={p.onClick}>
          <div className="w-full">
            <div className={cn(btn, 'py-[.6rem]')}>
              <p className={cn('flex-1 truncate px-1 text-left')}>{p.children}</p>
              {p.submenu && <IoIosArrowForward />}
            </div>
          </div>
        </Link>
      </li>
    )
  }

  return (
    <li className="w-full">
      <Link to={p.to} onClick={p.onClick}>
        <div className="w-full">
          <div className={btn}>
            <span className="inline-block h-5 w-5 shrink-0 text-2xl uppercase [&>*]:h-full [&>*]:w-full">{p.icon}</span>
            <p className={cn('flex-1 text-left', text)}>{p.children}</p>
          </div>
        </div>
      </Link>
    </li>
  )
}
