import { useFormContext, useWatch } from 'react-hook-form'
import { IContentCollection, IContentDocument } from '../../schema/index.js'

export const DocumentFormTitle = (props: { schema: IContentDocument<any, any> | IContentCollection<any, any> }) => {
  const form = useFormContext()

  const watched = useWatch({
    control: form.control,
    name: (props.schema.nodeId === 'collection' ? [props.schema.titleField as string] : []) as [string],
    defaultValue: props.schema.nodeId === 'collection' ? ['Untitled'] : [props.schema.label],
    disabled: props.schema.nodeId !== 'collection',
  })

  const value = props.schema.nodeId !== 'collection' ? props.schema.label : watched[0]

  return value
}
