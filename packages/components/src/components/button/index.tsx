import { cn } from 'mcn'

import { extend, Extend } from '../../util/forwardRef.js'

const colors = {
  none: '',
  default: 'hover:bg-frame',
  error: 'hover:border-error hover:opacity-80 bg-error/5 text-error',
  active: 'hover:border-active hover:opacity-80 bg-active/5 text-active',
  published: 'hover:border-published hover:opacity-80 bg-published/5 text-published',
}

const sizes = { default: 'py-1.5 px-2.5 text-sm', lg: 'px-5 py-2.5' }

const variant = { default: 'border', ghost: '' }

type ButtonProps = {
  color?: undefined | 'none' | 'error' | 'active' | 'published'
  size?: undefined | 'lg'
  variant?: undefined | 'ghost'
  icon?: React.ReactNode
  className?: string | undefined
}

export const button = (props: ButtonProps): string =>
  cn(
    'select-none rounded flex gap-1 disabled:hover:border-front/10 disabled:opacity-50 cursor-pointer items-center leading-none',
    variant[props.variant ?? 'default'],
    colors[props.color ?? 'default'],
    sizes[props.size ?? 'default'],
    props.className,
  )

export const buttonIcon = (hasChildren: boolean, size: ButtonProps['size']): string =>
  cn('relative overflow-visible flex items-center justify-center [&>*]:h-full [&>*]:w-full', {
    '-left-0.5': !!hasChildren && !size,
    'w-5 h-5 -top-[1px]': size === 'lg',
    'w-4 h-4 mr-0.5': !size,
    '': !size && !hasChildren,
  })

export const Button: Extend<'button', ButtonProps> = extend<'button', { icon?: React.ReactNode } & ButtonProps>(
  ({ color, size, icon, className, children, elementType, variant, ...props }, ref) => {
    const Element: any = elementType ?? 'button'
    return (
      <Element ref={ref} type="button" role="button" {...props} className={button({ size, color, variant, className })}>
        {icon && <span className={buttonIcon(!!children, size)}>{icon}</span>}
        {children}
      </Element>
    )
  },
)
