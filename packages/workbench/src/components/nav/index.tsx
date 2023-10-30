import LogoutIcon from '@heroicons/react/24/outline/ArrowLeftOnRectangleIcon'
import { useEffect, useRef, useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { Avatar, Button } from '@fiar/components'
import { Link, useRoute } from 'wouter'
import cn from 'mcn'

import { useWorkbenchPage, useWorkbenchPages } from '../hooks'
import { useFiarAppState } from '../../context'

export const NavPanel = (): JSX.Element => {
  const [isLanding] = useRoute('/')
  const [open, setopen] = useState(isLanding)
  const pages = useWorkbenchPages()

  const text = cn('truncate transition-all', [open, 'opacity-100 max-w-full', 'opacity-0 max-w-0 pointer-events-none'])
  useEffect(() => void (!isLanding ? setopen(false) : null), [])

  return (
    <div>
      <div className={cn('transition-[width]', [open, 'w-40 sm:w-52', 'w-12 sm:w-16'])} />
      <div
        className={cn(
          'fixed top-0 z-40 flex h-full flex-shrink-0 flex-col justify-between border-r transition-[width]',
          [open, 'w-40 sm:w-52', 'w-12 sm:w-16'],
        )}
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
          {pages.map((name) => (
            <NavPanelButton key={name} name={name} onClose={() => setopen(false)} open={open} />
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
  const [open, setopen] = useState(false)
  const user = useFiarAppState((x) => x.components['auth']?.user)
  const signout = useFiarAppState((x) => x.components['auth']?.signout)
  const ref = useRef<HTMLDivElement>(null)

  const text = cn('truncate transition-all', [
    p.open,
    'opacity-100 max-w-full',
    'opacity-0 max-w-0 pointer-events-none',
  ])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as any) && open) setopen(false)
    }
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [open])

  if (!user || !signout) return null

  return (
    <div className="relative px-2 pb-4 sm:px-4" ref={ref}>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => setopen((x) => !x)}
          className={cn('sm:hover:bg-front/5 flex w-full items-center gap-3 rounded-l-full', [open, 'sm:bg-front/5'])}
        >
          <Avatar {...user} />
          <p className={cn('flex-1 text-left', text)}>{user.displayName}</p>
        </button>
      </div>
      <div
        className={cn(
          'bg-back bg-back absolute bottom-0 left-full mb-5 ml-2 w-[max(80%,9rem)] rounded-sm border px-2 py-3 shadow-sm',
          [open, 'flex', 'hidden'],
        )}
      >
        <Button
          className="w-full py-2"
          onClick={() => {
            signout()
            setopen(false)
          }}
          icon={<LogoutIcon className="w-4" />}
        >
          Logout
        </Button>
      </div>
    </div>
  )
}

const NavPanelButton = (p: { name: `workbench:page:${string}`; open: boolean; onClose?: () => void }) => {
  const page = useWorkbenchPage(p.name)

  const [match] = useRoute(page?.path || '/')
  const text = cn('truncate transition-all', [
    p.open,
    'opacity-100 max-w-full',
    'opacity-0 max-w-0 pointer-events-none',
  ])
  const btn = cn('w-full flex items-center px-2 gap-4 rounded-sm py-2', [!!match, 'bg-front/10', 'hover:bg-front/5'])

  if (!page || !page.title) return null

  if (!page.icon) {
    return (
      <li className="w-full">
        <Link to={`/${page.path}`} onClick={p.onClose}>
          <div className="w-full">
            <div className={cn(btn, 'py-[.6rem]')}>
              <p className={cn('flex-1 truncate px-1 text-left')}>{page.title}</p>
            </div>
          </div>
        </Link>
      </li>
    )
  }

  return (
    <li className="w-full">
      <Link to={page.path} onClick={p.onClose}>
        <div className="w-full">
          <div className={btn}>
            <span className="inline-block h-5 w-5 shrink-0 text-2xl uppercase [&>*]:h-full [&>*]:w-full">
              {page.icon}
            </span>
            <p className={cn('flex-1 text-left', text)}>{page.title}</p>
          </div>
        </div>
      </Link>
    </li>
  )
}
