import { ElementRef } from 'react'
import cn from 'mcn'

import { forwardRef } from '../../util/forwardRef'

type SharedProps = {
  label?: React.ReactNode
  error?: React.ReactNode
  name?: string
}

export const Control: {
  <K extends keyof JSX.IntrinsicElements = 'div'>(
    p: {
      use?: K
      children?: React.ReactNode
      ref?: React.Ref<ElementRef<K>>
    } & SharedProps &
      JSX.IntrinsicElements[K],
  ): JSX.Element
  <P extends any, U extends (props: P) => React.ReactNode>(
    p: { use: U; icon?: React.ReactNode } & SharedProps & P,
  ): JSX.Element
} = forwardRef(({ use = 'div', children, label, name, error, className, ...props }: any, ref) => {
  const Element = use as any

  return (
    <div className={cn('relative transition-[padding]', [!!error, 'pb-6'], [!!label, 'pt-6'])}>
      {label && (
        <label htmlFor={name} className="group-focus-within:text-active absolute -top-0 left-2 text-sm">
          {label}
        </label>
      )}
      {error && (
        <label
          htmlFor={name}
          className="text-error/80 group-focus-within:text-error absolute -bottom-0 right-2 text-sm"
        >
          {error}
        </label>
      )}
      <Element
        {...props}
        ref={ref}
        className={cn(
          'border-front/5 bg-front/5 focus-within:border-active group w-full w-full rounded-sm border',
          props.className,
        )}
      >
        {children}
      </Element>
    </div>
  )
}) as any
