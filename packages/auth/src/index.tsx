import { WorkbenchPage, WorkbenchProvider } from '@fiar/workbench/types'
import { UsersIcon } from '@heroicons/react/24/outline'
import { FiarPlugin } from '@fiar/core'

import { AuthAuthorise } from './components/auth-authorize/index.js'
import { AuthConfig, AuthConfigProvider } from './context/index.js'
import { AuthUsers } from './components/auth-users/index.js'

export * from './components/index.js'
export * from './context/index.js'

export const fiarAuth =
  (config: AuthConfig): FiarPlugin =>
  (state) => {
    if (!config.disablePage) {
      const page: WorkbenchPage = {
        title: 'Users',
        path: 'users',
        icon: <UsersIcon />,
        element: <AuthUsers />,
      }
      state.addComponents({ 'workbench:page:auth': page })
    }
    const provider: WorkbenchProvider = (p) => (
      <AuthConfigProvider value={config}>
        <AuthAuthorise>{p.children}</AuthAuthorise>
      </AuthConfigProvider>
    )
    state.addComponents({ 'workbench:provider:auth': provider })
  }
