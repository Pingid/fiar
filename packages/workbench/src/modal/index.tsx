import { XMarkIcon } from '@heroicons/react/24/outline'
import { useTransitions } from 'react-class-transition'
import React, { Fragment, useEffect } from 'react'
import { Route, Switch } from 'wouter'

import { Modal } from '@fiar/components'

import { MemoryNavigationProvider } from '../router/memory.js'
import { DashboardRouter } from '../router/index.js'
import { useApps } from '../app/index.js'

export const WorkbenchModal = (p: { open: boolean; close: () => void; children: React.ReactNode }): JSX.Element => {
  const [bind, run] = useTransitions({
    wrapper: { enter: ['bg-black/0', 15, 'bg-black/60'], leave: [70, 'bg-black/0', 100] },
    container: {
      enter: ['translate-y-5 opacity-0', 100, 'translate-y-0 opacity-100'],
      leave: ['translate-y-5 opacity-0', 100],
    },
  })

  const close = () => run('leave').then(() => p.close())
  useEffect(() => void (p.open ? run('enter') : null), [p.open])

  return (
    <Modal closed={!p.open}>
      <div
        className="fixed flex h-full w-full pt-24 transition-all sm:items-center sm:justify-center sm:p-12"
        onClick={() => close()}
        ref={bind('wrapper')}
      >
        <div
          className="bg-back relative grid max-h-full min-h-[70vh] w-full max-w-3xl rounded border transition-all [grid-template:1fr/1fr]"
          onClick={(e) => e.stopPropagation()}
          ref={bind('container')}
        >
          <button className="hover:text-active absolute right-3 top-3 z-40" onClick={() => close()}>
            <XMarkIcon className="h-5 w-5" />
          </button>
          <div className="relative h-full w-full overflow-y-auto pb-3">{p.children}</div>
        </div>
      </div>
    </Modal>
  )
}

export const WorkbenchPageModal = (p: {
  open: boolean
  close: () => void
  children?: React.ReactNode
  app: string
  initialPath?: string
  onNav?: (to: string) => string | null
}): JSX.Element => {
  const pages = useApps((x) => x.pages)
  return (
    <MemoryNavigationProvider value={p.onNav}>
      <WorkbenchModal open={p.open} close={p.close}>
        <DashboardRouter routing="memory" initialPath={p.app}>
          <Switch>
            {pages.map((app) => {
              const to = app.href ?? `/${app.title.toLowerCase().replace(/(\s|\t|\n)+/gim, '-')}`
              return (
                <Fragment key={to}>
                  <Route path={to}>
                    <DashboardRouter routing="memory" basename={p.app} initialPath={p.initialPath as any}>
                      {app.children}
                    </DashboardRouter>
                  </Route>
                  <Route path={`${to}/*`}>
                    <DashboardRouter routing="memory" basename={p.app} initialPath={p.initialPath as any}>
                      {app.children}
                    </DashboardRouter>
                  </Route>
                </Fragment>
              )
            })}
          </Switch>
        </DashboardRouter>
      </WorkbenchModal>
    </MemoryNavigationProvider>
  )
}
