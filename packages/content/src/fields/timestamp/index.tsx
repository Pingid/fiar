import { Timestamp, serverTimestamp } from '@firebase/firestore'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { fromDate } from '@internationalized/date'
import { DatePicker } from '@nextui-org/react'
import { set } from 'react-hook-form'

import { useFieldPreview, useFieldForm, registerField, useFormFieldControl } from '../../context/field.js'
import { useDocumentHook } from '../../context/hooks.js'
import { IFieldTimestamp } from '../../schema/index.js'
import { Field } from '../../components/index.js'
import { date } from '../../util/index.js'

export const FormFieldTimestamp = () => {
  const field = useFieldForm<IFieldTimestamp>()
  const control = useFormFieldControl()

  const fromDateLocal = (date: Date) =>
    fromDate(date, field.schema.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone)

  useDocumentHook((e) => {
    const onUpdate = field.schema.auto === 'update'
    const onCreate = field.schema.auto === 'create'
    if (e.type === 'update' && onUpdate) set(e, field.name, serverTimestamp())
    if (e.type === 'add' && (onCreate || onUpdate)) set(e, field.name, serverTimestamp())
    if (e.type === 'set' && (onCreate || onUpdate)) set(e, field.name, serverTimestamp())
    return e
  })

  const value = control.field.value instanceof Timestamp ? fromDateLocal(control.field.value.toDate()) : undefined
  const minValue = field.schema.after ? fromDateLocal(new Date(field.schema.after)) : undefined
  const maxValue = field.schema.before ? fromDateLocal(new Date(field.schema.before)) : undefined
  const placholder = field.schema.placeholder ? fromDateLocal(new Date(field.schema.placeholder)) : undefined

  return (
    <Field {...field}>
      <DatePicker
        id={field.name}
        aria-label={field.name ?? ''}
        aria-labelledby={field.name ?? ''}
        granularity={field.schema.granularity ?? 'minute'}
        minValue={minValue as any}
        maxValue={maxValue as any}
        labelPlacement="outside"
        isInvalid={!!field.error}
        value={value as any}
        popoverProps={{ placement: 'bottom-end' }}
        placeholderValue={placholder}
        variant="bordered"
        classNames={{}}
        selectorIcon={
          <div>
            <CalendarDaysIcon className="h-5 w-5" />
          </div>
        }
        onChange={(x) =>
          control.field.onChange(Timestamp.fromDate(x.toDate(Intl.DateTimeFormat().resolvedOptions().timeZone)))
        }
      />
    </Field>
  )
}

export const PreviewFieldTimestamp = () => {
  const field = useFieldPreview<IFieldTimestamp>()
  return date(field.value.toDate()).format('DD/MM/YY HH:mm')
}

registerField('timestamp', { form: FormFieldTimestamp, preview: PreviewFieldTimestamp })
