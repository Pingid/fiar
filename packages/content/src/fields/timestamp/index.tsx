import { serverTimestamp } from '@firebase/firestore'
import { set } from 'react-hook-form'

import { FieldPreview, useFormField } from '../../context/field.js'
import { useDocumentHook } from '../../context/hooks.js'
import { IFieldTimestamp } from '../../schema/index.js'
import { date } from '../../util/index.js'

export const FormFieldTimestamp = () => {
  const field = useFormField<IFieldTimestamp>()

  useDocumentHook((e) => {
    if (e.type === 'update' && field.schema.computed === 'on-update') set(e.data, field.name, serverTimestamp())
    if (e.type === 'add' && field.schema.computed === 'on-create') set(e.data, field.name, serverTimestamp())
    if (e.type === 'set' && field.schema.computed === 'on-create') set(e.data, field.name, serverTimestamp())
    return e
  })

  return null
}

export const PreviewFieldTimestamp: FieldPreview<IFieldTimestamp> = (props) => {
  return date(props.value.toDate()).format('DD/MM/YY HH:mm')
}
