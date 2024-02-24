import { cn } from 'mcn'

import { extend, Extend } from '../../util/forwardRef.js'

const colors = {
  none: '',
  default: 'border border hover:bg-frame',
  error: 'border hover:border-error bg-error/5 text-error',
  active: 'border hover:border-active bg-active/5 text-active',
  published: 'border hover:border-published bg-published/5 text-published',
}

const sizes = { default: 'px-5 py-2.5', sm: 'py-1.5 px-2.5 text-sm' }

type DisplayProps = {
  color?: undefined | 'none' | 'error' | 'active' | 'published'
  size?: undefined | 'sm'
  className?: string | undefined
}

export const button = (props: DisplayProps): string =>
  cn(
    'select-none rounded flex gap-1 disabled:hover:border-front/10 disabled:opacity-50 cursor-pointer items-center leading-none',
    colors[props.color ?? 'default'],
    sizes[props.size ?? 'default'],
    props.className,
  )

export const buttonIcon = (hasChildren: boolean, size: DisplayProps['size']): string =>
  cn('relative overflow-visible flex items-center justify-center [&>*]:h-full [&>*]:w-full', {
    '-left-2': !!hasChildren && !size,
    'w-5 h-5 -top-[1px]': !size,
    'w-4 h-4 mr-0.5': size === 'sm',
    '': size === 'sm' && !hasChildren,
  })

export const Button: Extend<'button', { icon?: React.ReactNode } & DisplayProps> = extend<
  'button',
  { icon?: React.ReactNode } & DisplayProps
>(({ color, size, icon, className, children, elementType, ...props }, ref) => {
  const Element: any = elementType ?? 'button'
  return (
    <Element ref={ref} type="button" {...props} role="button" className={button({ size, color, className })}>
      {icon && <span className={buttonIcon(!!children, size)}>{icon}</span>}
      {children}
    </Element>
  )
})
