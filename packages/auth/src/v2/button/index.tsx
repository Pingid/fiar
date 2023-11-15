import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useLocation, Link } from 'wouter'
import { signOut } from '@firebase/auth'
import { cn } from 'mcn'

import { useNavOpen, ActionBottom } from '@fiar/workbench/v2'
import { useAuthUser, useFirebaseAuth } from '../context/index.js'

export const UserAuthState = () => {
  const [location] = useLocation()
  const match = /^\/login/.test(location)
  const auth = useFirebaseAuth()
  const user = useAuthUser()
  const open = useNavOpen()

  const btn = cn('w-full flex items-center px-2 gap-4 rounded-sm py-2', [!!match, 'bg-front/10', 'hover:bg-front/5'])
  const icon = cn('inline-block h-5 w-5 shrink-0 text-2xl uppercase [&>*]:h-full [&>*]:w-full')

  return (
    <ActionBottom>
      <p
        className={cn('truncate pb-3 pl-2 text-sm font-medium leading-none transition-opacity', [
          !open,
          'opacity-0',
          'opacity-100',
        ])}
      >
        {user?.displayName}
      </p>
      {user && (
        <button className={btn} onClick={() => signOut(auth)}>
          <span className={icon}>
            <ArrowLeftOnRectangleIcon />
          </span>
          <p className={cn('flex-1 truncate text-left')}>Logout</p>
        </button>
      )}
      {!user && !match && (
        <Link onClick={() => signOut(auth)} href={`/login?redirect=${location}`}>
          <a className={btn}>
            <span className={icon}>
              <ArrowRightOnRectangleIcon />
            </span>
            <p className={cn('flex-1 truncate text-left')}>Login</p>
          </a>
        </Link>
      )}
    </ActionBottom>
  )
}
