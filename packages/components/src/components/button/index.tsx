import { type ElementRef, type ForwardedRef, type ElementType, type ComponentProps } from 'react'
import { cn } from 'mcn'

import { forwardRef } from '../../util/forwardRef.js'

const colors = {
  none: '',
  default: 'border border hover:bg-frame',
  error: 'border hover:border-error bg-error/5 text-error',
  active: 'border hover:border-active bg-active/5 text-active',
  published: 'border hover:border-published bg-published/5 text-published',
}
const sizes = { default: 'px-5 py-2.5' }

// type LL = ElementRef<'button'>
export const button = (props: {
  color?: keyof typeof colors | undefined
  size?: keyof typeof sizes | undefined
  className?: string | undefined
}) =>
  cn(
    'leading-none select-none rounded flex gap-1 disabled:hover:border-front/10 disabled:opacity-50 cursor-pointer',
    colors[props.color ?? 'default'],
    sizes[props.size ?? 'default'],
    props.className,
  )

export const buttonIcon = (hasChildren?: any) =>
  cn('w-4.5 relative -top-[3px] h-3 overflow-visible [&>*]:h-5 [&>*]:w-5', [!!hasChildren, '-left-2.5'])

export const Button: {
  <E extends ElementType = 'button'>(
    {
      color,
      size,
      icon,
      className,
      children,
      elementType,
      ...props
    }: ComponentProps<E> & { children?: React.ReactNode; icon?: React.ReactNode; elementType?: E } & Parameters<
        typeof button
      >[0],
    ref?: ForwardedRef<ElementRef<E>>,
  ): JSX.Element
} = forwardRef(({ color, size, icon, className, children, elementType, ...props }, ref) => {
  const Element: any = elementType ?? 'button'
  return (
    <Element ref={ref} type="button" {...props} role="button" className={button({ size, color, className })}>
      {icon && <span className={buttonIcon(children)}>{icon}</span>}
      {children}
    </Element>
  )
})
