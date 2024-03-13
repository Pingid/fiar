import { Extensions } from '@fiar/workbench/extensions'

import { FormFieldTimestamp, PreviewFieldTimestamp } from '../fields/timestamp/index.js'
import { FormFieldString, PreviewFieldString } from '../fields/string/index.js'
import { FormFieldNumber, PreviewFieldNumber } from '../fields/number/index.js'
import { FormFieldList, PreviewFieldList } from '../fields/list/index.js'
import { FormFieldBool, PreviewFieldBool } from '../fields/bool/index.js'
import { FormFieldText, PreviewFieldText } from '../fields/text/index.js'
import { FormFieldMap, PreviewFieldMap } from '../fields/map/index.js'
import { FormFieldRef, PreviewFieldRef } from '../fields/ref/index.js'

import { FieldPreview } from './field.js'

type FieldForm = () => React.ReactNode
type FieldPreview = () => React.ReactNode

declare module '@fiar/workbench/extensions' {
  export interface Extensions {
    'field/list/form': FieldForm
    'field/list/preview': FieldPreview
    'field/bool/form': FieldForm
    'field/bool/preview': FieldPreview
    'field/number/form': FieldForm
    'field/number/preview': FieldPreview
    'field/ref/form': FieldForm
    'field/ref/preview': FieldPreview
    'field/string/form': FieldForm
    'field/string/preview': FieldPreview
    'field/map/form': FieldForm
    'field/map/preview': FieldPreview
    'field/timestamp/form': FieldForm
    'field/timestamp/preview': FieldPreview
    'field/text/form': FieldForm
    'field/text/preview': FieldPreview
  }
}

export const extensions = {
  'field/list/form': FormFieldList,
  'field/list/preview': PreviewFieldList,
  'field/bool/form': FormFieldBool,
  'field/bool/preview': PreviewFieldBool,
  'field/number/form': FormFieldNumber,
  'field/number/preview': PreviewFieldNumber,
  'field/ref/form': FormFieldRef,
  'field/ref/preview': PreviewFieldRef,
  'field/string/form': FormFieldString,
  'field/string/preview': PreviewFieldString,
  'field/map/form': FormFieldMap,
  'field/map/preview': PreviewFieldMap,
  'field/timestamp/form': FormFieldTimestamp,
  'field/timestamp/preview': PreviewFieldTimestamp,
  'field/text/form': FormFieldText,
  'field/text/preview': PreviewFieldText,
} satisfies Extensions
