import { useWatch } from 'react-hook-form'

import { useFormContext } from '../../../fields/lib/index.js'
import { IContentModel } from '../../../schema/index.js'

export const DocumentFormTitle = (props: IContentModel & { default?: string }) => {
  const form = useFormContext()

  const watched = useWatch({
    control: form.control,
    name: (props.type === 'collection' ? [props.titleField as string] : []) as [string],
    defaultValue: props.type === 'collection' ? ['Untitled'] : [props.label],
    disabled: props.type !== 'collection',
  })

  const value = props.type !== 'collection' ? props.label : watched[0]

  return value && value.trim() ? value : props.default
}
