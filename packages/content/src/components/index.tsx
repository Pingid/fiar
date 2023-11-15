import '@fiar/core/types'

import { ContentDocumentActionsPublish } from './document-actions-publish/index.js'
import { ContentDocumentActionsArchive } from './document-actions-archive/index.js'
import { ContentDocumentActionsDelete } from './document-actions-delete/index.js'
import { ContentDocumentActionsEdit } from './document-actions-edit/index.js'
import { ContentDocumentActions } from './document-actions/index.js'
import { ContentCollection } from './collection/index.js'
import { ContentDocument } from './document/index.js'
import { ContentList } from './list/index.js'

import { ContentFieldRecord } from './field-record/index.js'
import { ContentFieldNumber } from './field-number/index.js'
import { ContentFieldString } from './field-string/index.js'
import { ContentFieldArray } from './field-array/index.js'
import { ContentFieldText } from './field-text/index.js'
import { ContentFieldRef } from './field-ref/index.js'

declare module '@fiar/core/types' {
  export interface FiarComponents {
    [ContentCollection.label]?: typeof ContentCollection.Component
    [ContentDocument.label]?: typeof ContentDocument.Component
    [ContentList.label]?: typeof ContentList.Component
    [ContentDocumentActions.label]?: typeof ContentDocumentActions.Component
    [ContentDocumentActionsArchive.label]?: typeof ContentDocumentActionsArchive.Component
    [ContentDocumentActionsDelete.label]?: typeof ContentDocumentActionsDelete.Component
    [ContentDocumentActionsEdit.label]?: typeof ContentDocumentActionsEdit.Component
    [ContentDocumentActionsPublish.label]?: typeof ContentDocumentActionsPublish.Component

    [ContentFieldArray.label]?: typeof ContentFieldArray.Component
    [ContentFieldRecord.label]?: typeof ContentFieldRecord.Component
    [ContentFieldNumber.label]?: typeof ContentFieldNumber.Component
    [ContentFieldString.label]?: typeof ContentFieldString.Component
    [ContentFieldText.label]?: typeof ContentFieldText.Component
    [ContentFieldRef.label]?: typeof ContentFieldRef.Component
  }
}

export const components = {
  [ContentFieldArray.label]: ContentFieldArray.Component,
  [ContentFieldRecord.label]: ContentFieldRecord.Component,
  [ContentFieldNumber.label]: ContentFieldNumber.Component,
  [ContentFieldString.label]: ContentFieldString.Component,
  [ContentFieldText.label]: ContentFieldText.Component,
  [ContentFieldRef.label]: ContentFieldRef.Component,
}
