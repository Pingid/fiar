import { FieldText } from '../components/FieldText/index.js'
import {
  DocumentCard,
  CollectionCard,
  FieldArray,
  FieldBoolean,
  FieldNumber,
  FieldRef,
  FieldString,
  FieldStruct,
} from '../components/index.js'

declare module '@fiar/workbench/extensions' {
  export interface Extensions {
    'field:list': typeof FieldArray
    'field:bool': typeof FieldBoolean
    'field:number': typeof FieldNumber
    'field:path': typeof FieldRef
    'field:string': typeof FieldString
    'field:text': typeof FieldText
    'field:map': typeof FieldStruct

    'document:card': typeof DocumentCard
    'collection:card': typeof CollectionCard
  }
}

export const extensions = {
  'field:list': FieldArray,
  'field:bool': FieldBoolean,
  'field:number': FieldNumber,
  'field:path': FieldRef,
  'field:string': FieldString,
  'field:text': FieldText,
  'field:map': FieldStruct,
  'document:card': DocumentCard,
  'collection:card': CollectionCard,
}
