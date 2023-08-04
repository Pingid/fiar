import { forwardRef } from 'react'
import { cn } from 'mcn'

const variants = {
  default: 'bg-front/5 hover:bg-front/10 rounded-sm',
  link: 'hover border-b border-transparent hover:border-active hover:text-active disabled:border-transparent disabled:text-front',
  ghost: 'hover:text-active border border-transparent hover:border-active rounded-sm',
  'ghost:error': 'hover:text-error border border-transparent hover:border-error rounded-sm',
  'ghost:archived': 'hover:text-archived border border-transparent hover:border-archived rounded-sm',
  outline: 'border disabled:opacity-70 hover:border-active hover:text-active',
}

const sizes = {
  default: 'px-3 py-1',
  lg: 'px-6 py-3',
  sm: 'text-sm',
}

type SharedProps = {
  icon?: React.ReactNode
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export const Button: {
  <K extends keyof JSX.IntrinsicElements = 'button'>(
    p: {
      use?: K
      children?: React.ReactNode
    } & SharedProps &
      JSX.IntrinsicElements[K],
  ): JSX.Element
  <P extends any, U extends (props: P) => React.ReactNode>(
    p: { use: U; icon?: React.ReactNode } & SharedProps & P,
  ): JSX.Element
} = forwardRef(({ use = 'button', children, variant, size, icon, className, ...props }: any, ref) => {
  const Element = use as any
  const cls = cn(
    'flex items-center gap-1',
    variant ? (variants as any)[variant] : variants.default,
    size ? (sizes as any)[size] : sizes.default,
    className,
  )

  return (
    <Element {...props} ref={ref} className={cls}>
      {icon && <span>{icon}</span>}
      {children}
    </Element>
  )
}) as any
