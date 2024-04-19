import { cn } from 'mcn'
import { UseFieldForm } from '../../context/field.js'
import { IFields } from '../../schema/index.js'

export const Field = <T extends IFields>(props: UseFieldForm<T> & { children?: React.ReactNode }): JSX.Element => {
  return (
    <div>
      {props.schema.label && (
        <FieldLabel id={props.name} htmlFor={props.name} isRequired={!props.schema.optional} isInvalid={!!props.error}>
          {props.schema.label}
        </FieldLabel>
      )}
      {props.schema.description && (
        <FieldDescription isInvalid={!!props.error}>{props.schema.description}</FieldDescription>
      )}
      {props.children}
      <p
        className={cn('text-tiny text-danger px-1 text-right transition-all duration-75', [
          !props.error,
          'h-0 pt-0',
          'h-6 pt-1',
        ])}
      >
        {props.error}
      </p>
    </div>
  )
}

export const FieldLabel = ({
  isInvalid,
  isRequired,
  ...props
}: { isRequired?: boolean; isInvalid?: boolean } & JSX.IntrinsicElements['label']) => (
  <label
    {...props}
    className={cn(
      'text-foreground text-small block after:ml-0.5',
      [isInvalid, 'text-danger'],
      [isRequired, `after:text-danger after:content-['*']`],
      props.className,
    )}
  />
)

export const FieldDescription = ({ isInvalid, ...props }: { isInvalid?: boolean } & JSX.IntrinsicElements['p']) => (
  <p {...props} className={cn('text-tiny text-foreground-400 mb-2', [isInvalid, 'text-danger'], props.className)} />
)
