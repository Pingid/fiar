import { cn } from 'mcn'

import { forward, Forward } from '../../util/forwardRef.js'
import { Markdown } from '../markdown/index.js'

type FieldProps = {
  error?: string | null | Error | undefined
  name?: string
  label?: React.ReactNode
  description?: React.ReactNode
}

export const Field: Forward<'div', FieldProps> & { Control: Forward<'div', { error?: any }> } = forward<
  'div',
  FieldProps
>(({ error, name, label, children, description, ...props }, ref) => {
  const DESCRIPTION =
    typeof description === 'string' ? (
      <Markdown className="text-front/50 pb-2 leading-snug">{description}</Markdown>
    ) : description ? (
      <p className="text-front/50 pb-2">{description}</p>
    ) : null

  return (
    <div
      {...props}
      ref={ref}
      className={cn('group relative transition-[padding]', [!!error, 'pb-6'], [!!label, 'pt-6'], props.className)}
    >
      {label && (
        <label htmlFor={name} className="group-focus-within:text-active block pb-0.5 text-sm">
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

export const FieldControl: Forward<'div', { error?: any }> = forward<'div', { error?: any }>(
  ({ error, className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={cn(
        'bg-frame focus-within:bg-back w-full rounded border has-[select]:pr-1',
        [!!error, 'border-error', ' focus-within:border-line-focus'],
        className,
      )}
    />
  ),
)
