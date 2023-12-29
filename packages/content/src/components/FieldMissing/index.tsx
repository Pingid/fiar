import { IFieldBase } from '../../schema/index.js'

export const FieldMissing = (props: { field: IFieldBase }) => {
  return (
    <p className="text-front/60 text-sm">
      Missing component <span className="text-error">{props.field.component}</span>
    </p>
  )
}
