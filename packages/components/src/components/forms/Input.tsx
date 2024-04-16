import { cn } from 'mcn'
import { forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, JSX.IntrinsicElements['input']>((props, ref) => (
  <input
    {...props}
    className={cn(
      'disabled:text-front/60 w-full bg-transparent px-2 py-1.5 focus:border-none focus:outline-none',
      props.className,
    )}
    ref={ref}
  />
))

export const Checkbox = forwardRef<HTMLInputElement, JSX.IntrinsicElements['input']>((props, ref) => (
  <input
    type="checkbox"
    {...props}
    className={cn(
      'text-active bg-front/5 focus:ring-active m-2 shrink-0 rounded border disabled:pointer-events-none disabled:opacity-50',
      props.className,
    )}
    ref={ref}
  />
))
