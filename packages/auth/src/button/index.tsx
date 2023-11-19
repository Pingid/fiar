import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useLocation, Link } from 'wouter'
import { signOut } from '@firebase/auth'
import { cn } from 'mcn'

import { useNavOpen, NavActionBottom, NavButton } from '@fiar/workbench'
import { useAuthUser, useFirebaseAuth } from '../context/index.js'

export const UserAuthState = () => {
  const [location] = useLocation()
  const match = /^\/login/.test(location)
  const auth = useFirebaseAuth()
  const user = useAuthUser()
  const open = useNavOpen()

  return (
    <NavActionBottom>
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
        <button className="w-full" onClick={() => signOut(auth)}>
          <NavButton icon={<ArrowLeftOnRectangleIcon />} title="Logout" />
        </button>
      )}
      {!user && !match && (
        <Link onClick={() => signOut(auth)} href={`/login?redirect=${location}`}>
          <a className="w-full">
            <NavButton icon={<ArrowRightOnRectangleIcon />} title="Login" />
          </a>
        </Link>
      )}
    </NavActionBottom>
  )
}
