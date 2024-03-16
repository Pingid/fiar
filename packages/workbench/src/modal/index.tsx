import { XMarkIcon } from '@heroicons/react/24/outline'
import { Transition } from 'react-transition-group'
import React, { Fragment, useRef } from 'react'
import { Route, Switch } from 'wouter'
import { cn } from 'mcn'

import { Modal } from '@fiar/components'

import { InterceptProvider, Interceptor } from '../interceptor/index.js'
import { DashboardRouter } from '../router/index.js'
import { useApps } from '../app/index.js'

export const WorkbenchModal = (p: { open: boolean; close: () => void; children: React.ReactNode }): JSX.Element => {
  return (
    <Modal>
      <Animate open={p.open}>
        {(bg, container) => (
          <div
            className={cn('fixed flex h-full w-full pt-24 sm:items-center sm:justify-center sm:p-12', bg.className)}
            onClick={() => p.close()}
            ref={bg.ref}
          >
            <div
              className={cn(
                'bg-back relative grid max-h-full min-h-[70vh] w-full max-w-3xl rounded border [grid-template:1fr/1fr]',
                container.className,
              )}
              onClick={(e) => e.stopPropagation()}
              ref={container.ref}
            >
              <button className="hover:text-active absolute right-3 top-3 z-40" onClick={() => p.close()}>
                <XMarkIcon className="h-5 w-5" />
              </button>
              <div className="relative h-full w-full overflow-y-auto pb-3">{p.children}</div>
            </div>
          </div>
        )}
      </Animate>
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
  const interceptor = useRef<Interceptor>((cb) => cb())

  return (
    <WorkbenchModal open={p.open} close={() => interceptor.current(() => p.close())}>
      <InterceptProvider value={interceptor}>
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
      </InterceptProvider>
    </WorkbenchModal>
  )
}

const Animate = (p: {
  open: boolean
  children: (
    container: { ref: React.RefObject<HTMLDivElement>; className: string },
    wrapper: { ref: React.RefObject<HTMLDivElement>; className: string },
  ) => React.ReactNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const transition = cn('transition-[transform,background,opacity] ease-in-out')
  const delay = cn('delay-100')

  return (
    <Transition
      in={p.open}
      nodeRef={wrapperRef}
      unmountOnExit
      addEndListener={(done) => {
        if (!wrapperRef.current) done()
        else wrapperRef.current.addEventListener('transitionend', done, false)
      }}
    >
      {(wrapper) => (
        <Transition
          in={!p.open ? false : wrapper !== 'exited'}
          nodeRef={containerRef}
          addEndListener={(done) => {
            if (!containerRef.current) done()
            else containerRef.current.addEventListener('transitionend', done, false)
          }}
        >
          {(container) =>
            p.children(
              {
                ref: wrapperRef,
                className: cn(
                  transition,
                  [wrapper === 'exited', 'bg-black/0'],
                  [wrapper.startsWith('enter'), 'bg-black/60'],
                  [wrapper === 'exiting', cn('bg-black/0', delay)],
                ),
              },
              {
                ref: containerRef,
                className: cn(
                  transition,
                  [container === 'exited', cn('translate-y-5 opacity-0', delay)],
                  [container.startsWith('enter'), cn('translate-y-0 opacity-100', delay)],
                  [container === 'exiting', 'translate-y-5 opacity-0'],
                ),
              },
            )
          }
        </Transition>
      )}
    </Transition>
  )
}
