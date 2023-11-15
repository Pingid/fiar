import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js'

const ModalContext = createContext<React.RefObject<HTMLDivElement> | null>(null)
export const ModalProvider = ({
  children,
  ...props
}: { children: JSX.Element | null } & JSX.IntrinsicElements['div']) => {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <ModalContext.Provider value={ref}>
      <div {...props} ref={ref} />
      {children}
    </ModalContext.Provider>
  )
}

export const Modal = (p: { children: JSX.Element | null; closed?: boolean }) => {
  const [node, setnode] = useState<HTMLDivElement>()
  const ref = useContext(ModalContext)
  useEffect(() => void (ref?.current ? setnode(ref.current) : null), [])
  useLockBodyScroll(!p.closed)
  if (!node || p.closed) return null
  return <>{createPortal(p.children, node)}</>
}
