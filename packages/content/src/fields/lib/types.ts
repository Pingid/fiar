import type { InferSchemaType } from '@fiar/schema'
import type { Control } from 'react-hook-form'

import type { DocumentFormContext } from '../../context/form.js'
import type { IFields } from '../../schema/index.js'

export type FieldForm<T extends IFields = IFields> = (props: {
  field: T
  parent?: IFields
  control: Control<Record<string, any>, DocumentFormContext>
  name: string
}) => React.ReactNode

export type FieldPreview<T extends IFields = IFields> = (props: {
  field: T
  value: InferSchemaType<T>
  name: string
}) => React.ReactNode
