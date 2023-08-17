import { WorkbenchPage, WorkbenchProvider } from '@fiar/workbench/types'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import { FiarPlugin } from '@fiar/core'

import { AuthAuthorise } from './components/auth-authorize'
import { AuthConfig, AuthConfigProvider } from './context'
import { AuthUsers } from './components/auth-users'

export * from './components'
export * from './context'

export const fiarAuth =
  (config: AuthConfig): FiarPlugin =>
  (state) => {
    const page: WorkbenchPage = {
      title: 'Users',
      path: 'users',
      icon: <UsersIcon />,
      element: <AuthUsers />,
    }
    const provider: WorkbenchProvider = (p) => (
      <AuthConfigProvider value={config}>
        <AuthAuthorise>{p.children}</AuthAuthorise>
      </AuthConfigProvider>
    )
    state.addComponents({ 'workbench:page:auth': page, 'workbench:provider:auth': provider })
  }
