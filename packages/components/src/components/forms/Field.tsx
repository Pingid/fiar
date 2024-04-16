import { cn } from 'mcn'

import { forward, Forward } from '../../util/forwardRef.js'
import { Markdown } from '../markdown/index.js'

type FieldProps = {
  error?: string | undefined
  name?: string | undefined
  schema?: { label?: string; description?: string; optional?: boolean }
}

export const Field: Forward<'div', FieldProps> & { Control: Forward<'div', { error?: any }> } = forward<
  'div',
  FieldProps
>(({ error, name, schema, children, ...props }, ref) => {
  const DESCRIPTION =
    typeof schema?.description === 'string' ? (
      <Markdown className="text-front/50 pb-2 leading-snug">{schema?.description}</Markdown>
    ) : null

  return (
    <div
      ref={ref}
      data-testid={name}
      className={cn(
        'group relative transition-[padding]',
        [!!error, 'pb-6'],
        [!!schema?.label, 'pt-0'],
        props.className,
      )}
    >
      <label htmlFor={name} className="flex w-full justify-between pb-1 text-sm">
        <span>{schema?.label}</span>
        <span className="text-front/50">{schema?.optional && 'optional'}</span>
      </label>

      <label
        htmlFor={name}
        className={cn(
          'text-error/80 group-focus-within:text-error absolute bottom-0 right-0 z-0 block text-sm transition-opacity delay-75',
          [!!error, 'opacity-100', 'opacity-0'],
        )}
      >
        {error}
      </label>

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
        [!!error, 'border-error', ''],
        className,
      )}
    />
  ),
)
