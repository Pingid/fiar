import { serverTimestamp } from '@firebase/firestore'
import { set } from 'react-hook-form'

import { useFieldPreview, useFormField } from '../../context/field.js'
import { useDocumentHook } from '../../context/hooks.js'
import { IFieldTimestamp } from '../../schema/index.js'
import { date } from '../../util/index.js'

export const FormFieldTimestamp = () => {
  const field = useFormField<IFieldTimestamp>()

  useDocumentHook((e) => {
    const onUpdate = field.schema.computed === 'on-update'
    const onCreate = field.schema.computed === 'on-create'
    if (e.type === 'update' && onUpdate) set(e.data, field.name, serverTimestamp())
    if (e.type === 'add' && (onCreate || onUpdate)) set(e.data, field.name, serverTimestamp())
    if (e.type === 'set' && (onCreate || onUpdate)) set(e.data, field.name, serverTimestamp())
    return e
  })

  return null
}

export const PreviewFieldTimestamp = () => {
  const field = useFieldPreview<IFieldTimestamp>()
  return date(field.value.toDate()).format('DD/MM/YY HH:mm')
}
