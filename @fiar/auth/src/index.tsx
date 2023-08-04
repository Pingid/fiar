import { WorkbenchPage, WorkbenchProvider } from '@fiar/workbench/types'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import { FiarAppStore } from '@fiar/core'

import { AuthAuthorise } from './components/auth-authorize'
import { AuthConfig, AuthConfigProvider } from './context'
import { AuthUsers } from './components/auth-users'

export * from './components'
export * from './context'
export * from './types'

export const fiarAuth = (config: AuthConfig) => (p: FiarAppStore) => {
  const page: WorkbenchPage = {
    title: 'Users',
    path: 'users',
    icon: <UsersIcon />,
    element: (
      <div className="relative flex w-full flex-col [--header-pt:20px]">
        <AuthUsers />
      </div>
    ),
  }
  const provider: WorkbenchProvider = (p) => (
    <AuthConfigProvider value={config}>
      <AuthAuthorise>{p.children}</AuthAuthorise>
    </AuthConfigProvider>
  )
  p.setState((x) => ({
    pages: [...(x.pages || []), page],
    providers: [...(x.providers || []), provider],
  }))
  return p
}
