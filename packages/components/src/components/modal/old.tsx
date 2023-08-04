import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { createPortal } from 'react-dom'
import { create } from 'zustand'

import { cn } from 'mcn'

import { DoneProvider, useDone } from '../done'
import { useEnterLeave } from '../../hooks'
import { Button } from '../button'

export const useModalSwitch = () =>
  useReducer((a, b?: boolean) => {
    return typeof b === 'boolean' ? b : !a
  }, false)

const getStore = () =>
  create<{
    modal: React.RefObject<HTMLDivElement>
    root: React.RefObject<HTMLDivElement>
    title: React.RefObject<HTMLDivElement>
    open: boolean
  }>(() => ({
    modal: { current: null },
    root: { current: null },
    title: { current: null },
    open: false,
    close: () => {},
  }))

const ModalContext = createContext(getStore())

export const Modal = ({
  open,
  size,
  onClose,
  children,
  shouldClose,
}: {
  open: boolean
  size?: 'sm' | 'md' | 'lg' | 'full'
  shouldClose?: boolean
  children: React.ReactNode
  onClose: (open?: boolean) => void
}) => {
  const useStore = useContext(ModalContext)
  const root = useStore((x) => x.modal.current)

  useEffect(() => {
    const current = useStore.getState().open
    if (current !== open) useStore.setState({ open })
  }, [open])

  if (!root || !open) return null

  return createPortal(
    <DoneProvider onClose={onClose}>
      <Wrapper size={size || 'sm'} shouldClose={!!shouldClose}>
        {children}
      </Wrapper>
    </DoneProvider>,
    root,
  )
}

Modal.Provider = (props: JSX.IntrinsicElements['div']) => {
  const value = useMemo(getStore, [])
  useEffect(() => {
    let last = false
    const unsub = value.subscribe((x) => {
      if (x.open === last) return
      last = x.open
      if (last && x.root.current) x.root.current.setAttribute('aria-hidden', 'true')
      if (!last && x.root.current) x.root.current.removeAttribute('aria-hidden')
    })
    return () => {
      unsub()
      value.getState().root.current?.removeAttribute('aria-hidden')
    }
  }, [])
  return (
    <ModalContext.Provider value={value}>
      <div {...props} ref={(current) => value.setState({ root: { current } })} />
      <div className="absolute left-0 top-0" ref={(current) => value.setState({ modal: { current } })} />
    </ModalContext.Provider>
  )
}

const Wrapper = ({
  size = 'sm',
  children,
  shouldClose,
}: {
  size?: 'sm' | 'md' | 'lg' | 'full'
  shouldClose?: boolean
  children: React.ReactNode
}) => {
  const useStore = useContext(ModalContext)
  const wrapper = useEnterLeave({ enter: ['bg-back/0', 15, 'bg-back/80'], leave: ['bg-back/0', 250] })
  const modal = useEnterLeave({
    enter: ['translate-y-5 opacity-0', 15, 'translate-y-0 opacity-100'],
    leave: ['translate-y-5 opacity-0', 250],
  })
  const onDone = useDone()

  const close = useCallback(() => {
    if (!onDone) return
    return Promise.all([wrapper.leave(), modal.leave()]).then(() => onDone())
  }, [wrapper, modal, !!onDone])

  useEffect(() => {}, [])
  useEffect(() => void (shouldClose ? close() : null), [shouldClose])

  return (
    <div
      ref={wrapper.ref}
      className={cn(
        'fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center transition-all duration-300',
        [size === 'full', 'p-12', 'p-3'],
      )}
      onClick={close}
    >
      <div
        ref={modal.ref}
        className={cn(
          'bg-back1 relative grid max-h-full min-h-0 w-full min-w-0 overflow-hidden rounded-md border transition-all duration-300 [grid-template-rows:min-content_1fr]',
          {
            'max-w-lg': size === 'sm',
            'max-w-2xl': size === 'md',
            'max-w-4xl': size === 'lg',
            'h-full w-full': size === 'full',
          },
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <DoneProvider onClose={close}>
          <div ref={(current) => useStore.setState({ title: { current } })} />
          <div className="w-full overflow-y-auto">{children}</div>
        </DoneProvider>
      </div>
    </div>
  )
}

Modal.Title = ({ children }: { children: React.ReactNode }) => {
  const useStore = useContext(ModalContext)
  const root = useStore((x) => x.title.current)
  const onDone = useDone()
  if (!root) return null
  return createPortal(
    <div className="flex items-center justify-between border-b px-3 pb-2 pt-3">
      <h3 className="pl-1 text-xl">{children}</h3>
      <Button onClick={() => onDone && onDone()} className="w-auto">
        <XMarkIcon className="h-6 w-6" />
      </Button>
    </div>,
    root,
  )
}
