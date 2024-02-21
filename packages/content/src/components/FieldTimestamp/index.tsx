import { serverTimestamp } from '@firebase/firestore'
import { set } from 'react-hook-form'

import { FieldComponent, useDocumentHook } from '../../context/document.js'
import { IFieldTimestamp } from '../../schema/index.js'

export const FieldTimestamp: FieldComponent<IFieldTimestamp> = (props) => {
  useDocumentHook((x, type) => {
    if (props.field.computed === 'on-create' && type !== 'update') set(x, props.name, serverTimestamp())
    if (props.field.computed === 'on-update') set(x, props.name, serverTimestamp())
    return x
  })

  return null
}
