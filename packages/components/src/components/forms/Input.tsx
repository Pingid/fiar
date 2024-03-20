import { cn } from 'mcn'
import { forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, JSX.IntrinsicElements['input']>((props, ref) => (
  <input
    {...props}
    className={cn('w-full bg-transparent px-2 py-1.5 focus:border-none focus:outline-none', props.className)}
    ref={ref}
  />
))
