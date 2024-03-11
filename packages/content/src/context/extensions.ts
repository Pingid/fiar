import { Extensions } from '@fiar/workbench/extensions'

import {
  IFieldBoolean,
  IFieldList,
  IFieldNumber,
  IFieldRef,
  IFieldString,
  IFieldMap,
  IFieldTimestamp,
} from '../schema/index.js'

import { FormFieldTimestamp, PreviewFieldTimestamp } from '../fields/timestamp/index.js'
import { FormFieldString, PreviewFieldString } from '../fields/string/index.js'
import { FieldNumber, PreviewFieldNumber } from '../fields/number/index.js'
import { FormFieldList, PreviewFieldList } from '../fields/list/index.js'
import { FormFieldBool, PreviewFieldBool } from '../fields/bool/index.js'
import { FormFieldText, PreviewFieldText } from '../fields/text/index.js'
import { FormFieldMap, PreviewFieldMap } from '../fields/map/index.js'
import { FormFieldRef, PreviewFieldRef } from '../fields/ref/index.js'

import { FieldPreview } from './field.js'

type FieldForm = () => React.ReactNode

declare module '@fiar/workbench/extensions' {
  export interface Extensions {
    'field:form:list': FieldForm
    'field:preview:list': FieldPreview<IFieldList>
    'field:form:bool': FieldForm
    'field:preview:bool': FieldPreview<IFieldBoolean>
    'field:form:number': FieldForm
    'field:preview:number': FieldPreview<IFieldNumber>
    'field:form:ref': FieldForm
    'field:preview:ref': FieldPreview<IFieldRef>
    'field:form:string': FieldForm
    'field:preview:string': FieldPreview<IFieldString>
    'field:form:map': FieldForm
    'field:preview:map': FieldPreview<IFieldMap>
    'field:form:timestamp': FieldForm
    'field:preview:timestamp': FieldPreview<IFieldTimestamp>

    'field:form:text': FieldForm
    'field:preview:text': FieldPreview<IFieldString>
  }
}

export const extensions = {
  'field:form:list': FormFieldList,
  'field:preview:list': PreviewFieldList,
  'field:form:bool': FormFieldBool,
  'field:preview:bool': PreviewFieldBool,
  'field:form:number': FieldNumber,
  'field:preview:number': PreviewFieldNumber,
  'field:form:ref': FormFieldRef,
  'field:preview:ref': PreviewFieldRef,
  'field:form:string': FormFieldString,
  'field:preview:string': PreviewFieldString,
  'field:form:text': FormFieldText,
  'field:preview:text': PreviewFieldText,
  'field:form:map': FormFieldMap,
  'field:preview:map': PreviewFieldMap,
  'field:form:timestamp': FormFieldTimestamp,
  'field:preview:timestamp': PreviewFieldTimestamp,
} satisfies Extensions