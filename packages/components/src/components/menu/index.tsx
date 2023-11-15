import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import React, { forwardRef, useEffect, useState } from 'react'
import { cn } from 'mcn'

const sizes = { md: 'w-36 p-3' }

export const Menu: {
  <K extends keyof JSX.IntrinsicElements = 'div'>(
    p: {
      use?: K
      children: React.ReactNode
      btn?: React.ReactNode
      size?: keyof typeof sizes
    } & JSX.IntrinsicElements[K],
  ): JSX.Element
  <P extends any, U extends (props: P) => React.ReactNode>(
    p: { use: U; children: React.ReactNode; btn?: React.ReactNode } & P,
  ): JSX.Element
} = forwardRef(({ use = 'div', children, variant, btn, className, size, ...props }: any, ref) => {
  const [open, setOpen] = useState(false)
  const Element = use as any
  const sz = size ? (sizes as any)[size] : 'p-2'
  useEffect(() => {
    if (!open) return
    const handler = () => setOpen(false)
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [open])
  return (
    <Element {...props} className={cn('relative flex h-min', className)}>
      {btn || (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setOpen(true)
          }}
          className={cn('hover:text-active relative', [open, 'text-active'])}
          aria-expanded={open}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>
      )}

      <div
        role="menu"
        className={cn(
          'bg-back absolute -right-[1px] top-full z-30 mt-1 flex-col space-y-2 overflow-hidden rounded-sm border shadow-lg',
          [open, 'flex', 'hidden'],
          sz,
        )}
        ref={ref as any}
      >
        {React.Children.map(children, (child) => (child ? React.cloneElement(child, { role: 'menuitem' }) : child))}
      </div>
    </Element>
  )
}) as any
