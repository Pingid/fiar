import { register } from '@fiar/workbench/components'

import { FieldArray, FieldBoolean, FieldNumber, FieldRef, FieldString, FieldStruct } from '../fields/index.js'
import { CollectionCard } from '../collection/index.js'
import { DocumentCard } from '../document/index.js'

declare module '@fiar/workbench/components' {
  export interface Components {
    'field:array': typeof FieldArray
    'field:boolean': typeof FieldBoolean
    'field:number': typeof FieldNumber
    'field:ref': typeof FieldRef
    'field:string': typeof FieldString
    'field:struct': typeof FieldStruct

    'document:card': typeof DocumentCard
    'collection:card': typeof CollectionCard
  }
}

register('field:array', FieldArray)
register('field:boolean', FieldBoolean)
register('field:number', FieldNumber)
register('field:ref', FieldRef)
register('field:string', FieldString)
register('field:struct', FieldStruct)

register('document:card', DocumentCard)
register('collection:card', CollectionCard)
