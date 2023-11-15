import { ShieldExclamationIcon, ShieldCheckIcon, LockClosedIcon, UsersIcon } from '@heroicons/react/24/outline'
import { Page } from '@fiar/workbench'
import useMutation from 'swr/mutation'
import useQuery from 'swr'
import React from 'react'
import { cn } from 'mcn'

import { Avatar, Button, InfoCard, Menu, Pagination } from '@fiar/components'
import { httpsCallable, Functions } from '@firebase/functions'

import type { UserManageFunctions } from '../../functions/users/index.js'
import { useAuthConfig } from '../../context/index.js'

export const AuthUsers = (): JSX.Element => {
  const config = useAuthConfig()
  if (!config.functions) return <>Requires functions</>
  return <UserList functions={config.functions} />
}

const UserList = (p: { functions: Functions }) => {
  const [page, setPage] = React.useState<string[]>([])

  const list = useQuery(['auth-users', ...page], () =>
    func(p.functions, 'fiarUserList', { pageToken: page[page.length - 1] }),
  )
  const permit = useMutation(['auth-users'], (_, params: { arg: { uid: string; role?: string } }) =>
    func(p.functions, 'fiarUserPermission', params.arg),
  )

  const nextPageToken = list.data?.data.pageToken
  const next = nextPageToken ? () => setPage([...page, nextPageToken]) : undefined
  const prev = page.length > 0 ? () => setPage(page.slice(0, -1)) : undefined

  return (
    <Page
      error={permit.error?.message || list.error?.message}
      loading={list.isLoading || permit.isMutating}
      breadcrumb={[{ title: 'Users', icon: <UsersIcon className="w-4" />, disabled: true }]}
      action={<Pagination page={page.length + 1} prev={prev} next={next} />}
    >
      <ul className="mt-6 space-y-6" data-testid="doc-list">
        {list.data?.data.users.map((x) => {
          const role = x.customClaims?.['fiar']
          return (
            <li className="flex" key={x.uid} data-testid="doc-item">
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
                    icon={<ShieldExclamationIcon className="h-4 w-4" />}
                    onClick={() => permit.trigger({ uid: x.uid, role: 'admin' })}
                  >
                    Admin
                  </Button>
                )}
                {(role === 'admin' || !role) && (
                  <Button
                    icon={<ShieldCheckIcon className="h-4 w-4" />}
                    onClick={() => permit.trigger({ uid: x.uid, role: 'editor' })}
                  >
                    Editor
                  </Button>
                )}
                {role && (
                  <Button icon={<LockClosedIcon className="h-4 w-4" />} onClick={() => permit.trigger({ uid: x.uid })}>
                    Revoke
                  </Button>
                )}
              </Menu>
            </li>
          )
        })}
      </ul>
    </Page>
  )
}

const func = <K extends keyof UserManageFunctions>(
  functions: Functions,
  name: K,
  args: Parameters<UserManageFunctions[K]['run']>[0]['data'],
) =>
  httpsCallable<
    Parameters<UserManageFunctions[K]['run']>[0]['data'],
    Awaited<ReturnType<UserManageFunctions[K]['run']>>
  >(
    functions,
    name,
  )(args)
