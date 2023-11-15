import { cn } from 'mcn'

import { forwardRefElem, forwardRefElement } from '../../util/forwardRef.js'

type FieldProps = {
  error?: string | null | Error | undefined
  name?: string
  label?: React.ReactNode
  children: React.ReactNode
} & JSX.IntrinsicElements['div']

export const Field: {
  (props: FieldProps): React.ReactNode
  Control: (props: JSX.IntrinsicElements['div'] & React.RefAttributes<HTMLDivElement>) => JSX.Element
} = forwardRefElement<'div', FieldProps>(({ error, name, label, children, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn('relative transition-[padding]', [!!error, 'pb-6'], [!!label, 'pt-6'], props.className)}
    >
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
          {error instanceof Error ? error.message : error}
        </label>
      )}
      {children}
    </div>
  )
}) as any

Field.Control = forwardRefElem<'div'>((props, ref) => (
  <div
    {...props}
    ref={ref}
    className={cn(
      'border-front/5 bg-front/5 focus-within:border-active group w-full rounded-sm border',
      props.className,
    )}
  />
))
