import { ModalProvider } from '@fiar/components'
import { createRoot } from 'react-dom/client'
import { FiarPlugin } from '@fiar/core'

import { WorkbenchRouter, WorkbenchProviders, WorkbenchPages } from './components/router/index.js'
import { WorkbenchConfig, WorkbenchConfigProvider } from './context/config.js'
import { Landing } from './components/landing/index.js'
import { FiarAppContext } from './context/index.js'
import { NavPanel } from './components/index.js'

export * from './components/index.js'
export * from './context/index.js'
export * from './types/index.js'

export const fiarWorkbench =
  (config: WorkbenchConfig): FiarPlugin =>
  (state, store) => {
    const Dashboard = () => (
      <ModalProvider className="fixed left-0 top-0 z-50 [--wb-nav-pb:6px] [--wb-nav-pt:18px] [--wb-page-px:10px] sm:[--wb-nav-pb:0px] sm:[--wb-nav-pt:12px]">
        <WorkbenchConfigProvider value={config}>
          <FiarAppContext.Provider value={store}>
            <WorkbenchProviders>
              <WorkbenchRouter basename={config.basename} routing={config.routing}>
                <div className="flex !min-h-[100dvh] min-h-[100vh] w-full [--wb-page-px:10px] [--wb-nav-pb:16px] [--wb-nav-pt:20px] sm:[--wb-nav-pb:0px] sm:[--wb-nav-pt:18px]">
                  <NavPanel />
                  <WorkbenchPages />
                </div>
              </WorkbenchRouter>
            </WorkbenchProviders>
          </FiarAppContext.Provider>
        </WorkbenchConfigProvider>
      </ModalProvider>
    )

    state.addComponents({ 'workbench:page:landing': { path: '/', element: <Landing /> } })
    state.setDashboard(Dashboard)
    state.setRender((node) => createRoot(node).render(<Dashboard />))
  }
