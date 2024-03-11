import { useWatch } from 'react-hook-form'

import { useFormContext } from '../../../fields/lib/index.js'
import { useModel } from '../../../context/model.js'

export const DocumentFormTitle = (props: { default?: string }) => {
  const form = useFormContext()
  const model = useModel()

  const watched = useWatch({
    control: form.control,
    name: (model.type === 'collection' ? [model.titleField as string] : []) as [string],
    defaultValue: model.type === 'collection' ? ['Untitled'] : [model.label],
    disabled: model.type !== 'collection',
  })

  const value = model.type !== 'collection' ? model.label : watched[0]

  return value && value.trim() ? value : props.default
}
