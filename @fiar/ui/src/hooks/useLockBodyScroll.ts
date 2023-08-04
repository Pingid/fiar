import { useEffect } from 'react'

export const useLockBodyScroll = (active: boolean) => {
  useEffect(() => {
    const originalOverflowStyle = document.body.style.overflow
    if (active) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = originalOverflowStyle
    return () => void (document.body.style.overflow = originalOverflowStyle)
  }, [active])
}
