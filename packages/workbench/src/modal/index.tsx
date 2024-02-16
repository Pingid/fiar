import { CSSTransition, Transition } from 'react-transition-group'
import { XMarkIcon } from '@heroicons/react/24/outline'
import React, { Fragment, useEffect, useRef } from 'react'
import { Route, Switch } from 'wouter'
import { cn } from 'mcn'

import { Modal } from '@fiar/components'

import { DashboardRouter } from '../router/index.js'
import { useApps } from '../app/index.js'

export const WorkbenchModal = (p: { open: boolean; close: () => void; children: React.ReactNode }): JSX.Element => {
  const container = useRef<HTMLDivElement>(null)
  const wrapper = useRef<HTMLDivElement>(null)

  useLockBodyScroll(p.open)

  return (
    <Modal>
      <CSSTransition
        in={p.open}
        nodeRef={wrapper}
        classNames={{
          appear: 'bg-black/0',
          enter: 'bg-black/60',
          enterDone: 'bg-black/60',
          exit: 'bg-black/0 delay-75',
        }}
        unmountOnExit
        addEndListener={(done) => {
          if (!wrapper.current) done()
          else wrapper.current.addEventListener('transitionend', done, false)
        }}
      >
        {(parent) => (
          <div
            className="fixed flex h-full w-full pt-24 transition-all sm:items-center sm:justify-center sm:p-12"
            onClick={() => p.close()}
            ref={wrapper}
          >
            <Transition
              in={!p.open ? false : parent !== 'exited'}
              nodeRef={container}
              addEndListener={(done) => {
                if (!container.current) done()
                else container.current.addEventListener('transitionend', done, false)
              }}
            >
              {(child) => (
                <div
                  className={cn(
                    'bg-back relative grid max-h-full min-h-[70vh] w-full max-w-3xl rounded border transition-all [grid-template:1fr/1fr]',
                    {
                      'translate-y-5 opacity-0 delay-75': child === 'exited',
                      'translate-y-0 opacity-100 delay-75': child === 'entering' || child === 'entered',
                      'translate-y-5 opacity-0': child === 'exiting',
                    },
                  )}
                  onClick={(e) => e.stopPropagation()}
                  ref={container}
                >
                  <button className="hover:text-active absolute right-3 top-3 z-40" onClick={() => p.close()}>
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                  <div className="relative h-full w-full overflow-y-auto pb-3">{p.children}</div>
                </div>
              )}
            </Transition>
          </div>
        )}
      </CSSTransition>
    </Modal>
  )
}

export const WorkbenchPageModal = (p: {
  open: boolean
  close: () => void
  children?: React.ReactNode
  path?: string
  static?: boolean
}): JSX.Element => {
  const pages = useApps((x) => x.pages)

  return (
    <WorkbenchModal open={p.open} close={p.close}>
      <DashboardRouter router={{ ...p, type: 'memory' }}>
        <Switch>
          {pages.map((app) => {
            const to = app.href ?? `/${app.title.toLowerCase().replace(/(\s|\t|\n)+/gim, '-')}`
            return (
              <Fragment key={to}>
                <Route path={to} nest>
                  {app.children}
                </Route>
                <Route path={`${to}/*`} nest>
                  {app.children}
                </Route>
              </Fragment>
            )
          })}
        </Switch>
      </DashboardRouter>
    </WorkbenchModal>
  )
}

const useLockBodyScroll = (active: boolean) => {
  useEffect(() => {
    const originalOverflowStyle = document.body.style.overflow
    if (active) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = originalOverflowStyle
    return () => void (document.body.style.overflow = originalOverflowStyle)
  }, [active])
}
