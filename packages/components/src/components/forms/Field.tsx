import { cn } from 'mcn'

import { forwardRefElem, forwardRefElement } from '../../util/forwardRef.js'
import { Markdown } from '../markdown/index.js'

type FieldProps = {
  error?: string | null | Error | undefined
  name?: string
  label?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
} & JSX.IntrinsicElements['div']

export const Field: {
  (props: FieldProps): React.ReactNode
  Control: (
    props: JSX.IntrinsicElements['div'] & React.RefAttributes<HTMLDivElement> & { error?: boolean },
  ) => JSX.Element
} = forwardRefElement<'div', FieldProps>(({ error, name, label, children, description, ...props }, ref) => {
  const DESCRIPTION =
    typeof description === 'string' ? (
      <Markdown className="text-front/50 pb-1 text-sm">{description}</Markdown>
    ) : (
      <p className="text-front/50 pb-1 text-sm">{description}</p>
    )

  return (
    <div
      {...props}
      ref={ref}
      className={cn('relative transition-[padding]', [!!error, 'pb-6'], [!!label, 'pt-6'], props.className)}
    >
      {label && (
        <label htmlFor={name} className="group-focus-within:text-active absolute -top-0 text-sm">
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
      {DESCRIPTION}
      {children}
    </div>
  )
}) as any

Field.Control = forwardRefElem<'div', { error?: any }>(({ error, className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cn(
      'bg-frame focus-within:bg-back w-full rounded border',
      [!!error, 'border-error', ' focus-within:border-line-focus'],
      className,
    )}
  />
))
