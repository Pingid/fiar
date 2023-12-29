import { FieldArray } from '../components/FieldArray/index.js'
import { FieldBoolean } from '../components/FieldBoolean/index.js'
import { FieldNumber } from '../components/FieldNumber/index.js'
import { FieldRef } from '../components/FieldRef/index.js'
import { FieldString } from '../components/FieldString/index.js'
import { FieldStruct } from '../components/FieldStruct/index.js'
import { FieldText } from '../components/FieldText/index.js'

declare module '@fiar/workbench/extensions' {
  export interface Extensions {
    'field:list': typeof FieldArray
    'field:bool': typeof FieldBoolean
    'field:number': typeof FieldNumber
    'field:ref': typeof FieldRef
    'field:string': typeof FieldString
    'field:text': typeof FieldText
    'field:map': typeof FieldStruct
  }
}

export const extensions = {
  'field:list': FieldArray,
  'field:bool': FieldBoolean,
  'field:number': FieldNumber,
  'field:ref': FieldRef,
  'field:string': FieldString,
  'field:text': FieldText,
  'field:map': FieldStruct,
}
