import { RenderComponent } from '@fiar/workbench/v2/components'
import { Field } from '@fiar/components'

import { type FieldComponent } from '../../../field/index.js'
import { IFieldStruct, IFields } from '../../../schema/index.js'

export const FieldStruct: FieldComponent<IFieldStruct<Record<string, IFields>>> = (props) => {
  return (
    <Field className="space-y-3" label={props.field.label}>
      {Object.keys(props.field.fields).map((key) => {
        const field = props.field.fields[key] as IFields
        const name = props.name ? `${props.name}.${key}` : key
        return (
          <RenderComponent key={name} component={field.component} props={{ ...props, name, field }}>
            <p className="text-front/60 text-sm">
              Missing component <span className="text-error">{field.component}</span>
            </p>
          </RenderComponent>
        )
      })}
    </Field>
  )
}
