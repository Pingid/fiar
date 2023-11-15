import { createContext, useCallback, useContext } from 'react'
import { useUpdatedRef } from '../../hooks/index.js'

const DoneContext = createContext<(() => void) | null>(null)
export const DoneProvider = ({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) => {
  const ref = useUpdatedRef(onClose)
  const close = useCallback(() => ref.current && ref.current(), [])
  return <DoneContext.Provider value={onClose ? close : null}>{children}</DoneContext.Provider>
}

export const useDone = () => useContext(DoneContext)
