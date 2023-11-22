import { IField } from '../../schema/index.js'

export const FieldMissing = (props: { field: IField<any, any> }) => {
  return (
    <p className="text-front/60 text-sm">
      Missing component <span className="text-error">{props.field.component}</span>
    </p>
  )
}
