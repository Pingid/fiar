import { UseExtension } from '@fiar/workbench/extensions'

import type { IFields } from '../../schema/index.js'
import type { FieldForm } from './types.js'

export const FormField = (props: Parameters<FieldForm>[0]) => {
  const extension = `field:form:${props.field.component || props.field.type}`
  return (
    <UseExtension
      extension={extension}
      props={{ ...props, parent: props.field }}
      fallback={
        <p className="text-front/60 text-sm">
          Missing component <span className="text-error">{props.field.component}</span>
        </p>
      }
    />
  )
}

export const PreviewField = (props: { field: IFields; value: any; name: string }) => {
  const extension = `field:preview:${props.field.component || props.field.type}`
  return <UseExtension extension={extension} props={{ ...props, parent: props.field }} fallback={null} />
}
