import { serverTimestamp } from '@firebase/firestore'
import { set } from 'react-hook-form'

import { type FieldForm, type FieldPreview, useFormHook } from '../lib/index.js'
import { IFieldTimestamp } from '../../schema/index.js'
import { date } from '../../util/index.js'

export const FormFieldTimestamp: FieldForm<IFieldTimestamp> = (props) => {
  useFormHook((x, type) => {
    if (props.field.computed === 'on-create' && type !== 'update') set(x, props.name, serverTimestamp())
    if (props.field.computed === 'on-update') set(x, props.name, serverTimestamp())
    return x
  })

  return null
}

export const PreviewFieldTimestamp: FieldPreview<IFieldTimestamp> = (props) => {
  return date(props.value.toDate()).format('DD/MM/YY HH:mm')
}
