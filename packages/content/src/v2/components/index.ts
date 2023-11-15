import { register } from '@fiar/workbench/v2/components'

import { FieldArray } from './fields/array/index.js'
import { FieldBoolean } from './fields/boolean/index.js'
import { FieldNumber } from './fields/number/index.js'
import { FieldRef } from './fields/ref/index.js'
import { FieldString } from './fields/string/index.js'
import { FieldStruct } from './fields/struct/index.js'

import { DocumentCard } from './document/index.js'
import { CollectionCard } from './collection/index.js'

export { FieldArray } from './fields/array/index.js'
export { FieldBoolean } from './fields/boolean/index.js'
export { FieldNumber } from './fields/number/index.js'
export { FieldRef } from './fields/ref/index.js'
export { FieldString } from './fields/string/index.js'
export { FieldStruct } from './fields/struct/index.js'

declare module '@fiar/workbench/v2/components' {
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
