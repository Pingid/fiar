import { useWatch } from 'react-hook-form'

import { useModel, usePathRef } from '../../../context/model.js'
import { useFormContext } from '../../../context/field.js'

export const DocumentFormTitle = () => {
  const model = useModel()
  const path = usePathRef()

  if (model.type === 'collection' && model.layout?.titleField) {
    return <TitleField titleField={model.layout.titleField} />
  }
  if (model.type === 'collection') return path.split('/').slice(-1)[0] || model.label
  return model.label
}

const TitleField = (props: { titleField: string }) => {
  const form = useFormContext()
  const watched = useWatch({ control: form.control, name: `data.${props.titleField}`, defaultValue: 'Untitled' })
  return watched
}
