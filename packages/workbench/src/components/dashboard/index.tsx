import { Outlet } from 'react-router-dom'

import { FiarAppStore } from '@fiar/core'

import { FiarAppContext } from '../../context'
import { Router } from '../router'
import { NavPanel } from '../nav'

export const Dashboard = (p: { store: FiarAppStore }): JSX.Element => (
  <FiarAppContext.Provider value={p.store}>
    <Router>
      <div className="flex !min-h-[100dvh] min-h-[100vh] w-full">
        <NavPanel />
        <Outlet />
      </div>
    </Router>
  </FiarAppContext.Provider>
)
