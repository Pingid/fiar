import { useWatch } from 'react-hook-form'

import { useFormContext } from '../../../context/field.js'
import { useModel } from '../../../context/model.js'

export const DocumentFormTitle = () => {
  const model = useModel()
  if (model.type === 'collection' && model.titleField) return <TitleField titleField={model.titleField} />
  return model.label
}

const TitleField = (props: { titleField: string }) => {
  const form = useFormContext()
  const watched = useWatch({ control: form.control, name: props.titleField, defaultValue: 'Untitled' })
  return watched
}
