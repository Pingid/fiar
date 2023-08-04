import { createRoot } from 'react-dom/client'
import { FiarAppStore } from '@fiar/core'

import { WorkbenchConfig, WorkbenchConfigProvider } from './context/config'
import { Landing } from './components/landing'
import { Dashboard } from './components'
import { WorkbenchPage } from './types'

export * from './components'
export * from './context'
export * from './types'

export const fiarWorkbench = (config: WorkbenchConfig) => (store: FiarAppStore) => {
  const page: WorkbenchPage = { title: '', index: true, element: <Landing /> }

  store.setState((x) => ({
    pages: [...(x.pages || []), page],
    Dashboard: () => (
      <WorkbenchConfigProvider value={config}>
        <Dashboard store={store} />
      </WorkbenchConfigProvider>
    ),
    render: (node) =>
      createRoot(node).render(
        <WorkbenchConfigProvider value={config}>
          <Dashboard store={store} />
        </WorkbenchConfigProvider>,
      ),
  }))
  return store
}
