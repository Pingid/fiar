import useMutation from 'swr/mutation'
import useQuery from 'swr'
import React from 'react'
import cn from 'mcn'

import { Avatar, Button, Header, InfoCard, Menu, Pagination } from '@fiar/ui'
import { httpsCallable, Functions } from '@firebase/functions'
import type { UserRecord } from 'firebase-functions/v1/auth'

import ShieldExclamationIcon from '@heroicons/react/24/outline/ShieldExclamationIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'
import LockClosedIcon from '@heroicons/react/24/outline/LockClosedIcon'

import { useAuthConfig } from '../../context'

export const AuthUsers = (): JSX.Element => {
  const config = useAuthConfig()
  if (!config.functions) return <>Requires functions</>
  return <UserList functions={config.functions} />
}

const UserList = (p: { functions: Functions }) => {
  const [page, setPage] = React.useState<string[]>([])

  const listUsersFunction = httpsCallable<any, { users: UserRecord[]; pageToken?: string }>(
    p.functions,
    'fireAuthUserList',
  )
  const updatePermissionsFunction = httpsCallable<any, { users: UserRecord[]; pageToken?: string }>(
    p.functions,
    'fireAuthUserPermission',
  )

  const list = useQuery(['auth-users', ...page], () => listUsersFunction({ pageToken: page[page.length - 1] }))
  const permit = useMutation(['auth-users'], (_, params: { arg: { uid: string; role?: string } }) =>
    updatePermissionsFunction(params.arg),
  )

  const nextPageToken = list.data?.data.pageToken
  const next = nextPageToken ? () => setPage([...page, nextPageToken]) : undefined
  const prev = page.length > 0 ? () => setPage(page.slice(0, -1)) : undefined
  const error = (
    <>
      {list.error?.message} {permit.error?.message}
    </>
  )
  return (
    <>
      <Header>
        <Header.Content loading={list.isLoading} error={error}>
          <Pagination page={page.length + 1} prev={prev} next={next} />
        </Header.Content>
      </Header>
      <ul className="mt-6 space-y-6 pl-3 pr-2">
        {list.data?.data.users.map((x) => {
          const role = x.customClaims?.['fiar']
          return (
            <li className="flex" key={x.uid}>
              <div className="flex w-full gap-1 border-b">
                <Avatar {...x} className="mt-1" />
                <InfoCard
                  use="div"
                  title={x.displayName}
                  asside={
                    <p className={cn('text-sm sm:text-base', [!role, 'text-front/70'])}>{role || 'not a member'}</p>
                  }
                >
                  <div className="w-full" />
                  <p className="text-sm">{x.email}</p>
                </InfoCard>
              </div>
              <Menu size="md" className="pt-1">
                {(role === 'editor' || !role) && (
                  <Button
                    variant="ghost"
                    icon={<ShieldExclamationIcon className="h-4 w-4" />}
                    onClick={() => permit.trigger({ uid: x.uid, role: 'admin' })}
                  >
                    Admin
                  </Button>
                )}
                {(role === 'admin' || !role) && (
                  <Button
                    variant="ghost"
                    icon={<ShieldCheckIcon className="h-4 w-4" />}
                    onClick={() => permit.trigger({ uid: x.uid, role: 'editor' })}
                  >
                    Editor
                  </Button>
                )}
                {role && (
                  <Button
                    variant="ghost"
                    icon={<LockClosedIcon className="h-4 w-4" />}
                    onClick={() => permit.trigger({ uid: x.uid })}
                  >
                    Revoke
                  </Button>
                )}
              </Menu>
            </li>
          )
        })}
      </ul>
    </>
  )
}
