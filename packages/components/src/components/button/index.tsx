import { ElementRef, ForwardedRef } from 'react'
import { cn } from 'mcn'

import { forwardRef } from '../../util/forwardRef.js'

const colors = {
  default: 'border hover:bg-front/5',
  error: 'hover:border-error bg-error/5 text-error',
  active: 'hover:border-active bg-active/5 text-active',
  published: 'hover:border-published bg-published/5 text-published',
}
const sizes = { default: 'px-5 py-2.5' }

export const Button = forwardRef(
  <K extends keyof JSX.IntrinsicElements = 'button'>(
    {
      color,
      size,
      icon,
      use,
      className,
      children,
      ...props
    }: JSX.IntrinsicElements[K] & {
      use?: K
      color?: keyof typeof colors
      size?: keyof typeof sizes
      icon?: React.ReactNode
    },
    ref?: ForwardedRef<ElementRef<K>>,
  ) => {
    const cls = cn('leading-none flex gap-1 disabled:hover:border-front/10 disabled:opacity-50 border cursor-pointer')
    const Element: any = use ?? 'button'
    return (
      <Element
        ref={ref}
        {...props}
        className={cn(colors[color ?? 'default'], sizes[size ?? 'default'], cls, className)}
      >
        {icon && (
          <span className="w-4.5 relative -left-2.5 -top-[3px] h-3 overflow-visible [&>*]:h-5 [&>*]:w-5">{icon}</span>
        )}
        {children}
      </Element>
    )
  },
)
