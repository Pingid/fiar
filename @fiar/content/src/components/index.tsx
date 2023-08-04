import '@fiar/core/types'

import { ContentCollection } from './collection'
import { ContentDocument } from './document'
import { ContentLayout } from './layout'
import { ContentList } from './list'
import { ContentDocumentActionsPublish } from './document-actions-publish'
import { ContentDocumentActionsArchive } from './document-actions-archive'
import { ContentDocumentActionsDelete } from './document-actions-delete'
import { ContentDocumentActionsEdit } from './document-actions-edit'
import { ContentDocumentActions } from './document-actions'
import { ContentFieldRecord } from './field-record'
import { ContentFieldString } from './field-string'
import { ContentFieldArray } from './field-array'
import { ContentFieldRef } from './field-ref'
import { ContentFieldText } from './field-text'

declare module '@fiar/core/types' {
  export interface FiarComponents {
    [ContentCollection.label]?: typeof ContentCollection.Component
    [ContentDocument.label]?: typeof ContentDocument.Component
    [ContentLayout.label]?: typeof ContentLayout.Component
    [ContentList.label]?: typeof ContentList.Component
    [ContentDocumentActions.label]?: typeof ContentDocumentActions.Component
    [ContentDocumentActionsArchive.label]?: typeof ContentDocumentActionsArchive.Component
    [ContentDocumentActionsDelete.label]?: typeof ContentDocumentActionsDelete.Component
    [ContentDocumentActionsEdit.label]?: typeof ContentDocumentActionsEdit.Component
    [ContentDocumentActionsPublish.label]?: typeof ContentDocumentActionsPublish.Component

    [ContentFieldArray.label]?: typeof ContentFieldArray.Component
    [ContentFieldRecord.label]?: typeof ContentFieldRecord.Component
    [ContentFieldString.label]?: typeof ContentFieldString.Component
    [ContentFieldText.label]?: typeof ContentFieldText.Component
    [ContentFieldRef.label]?: typeof ContentFieldRef.Component
  }
}

export const components = {
  [ContentFieldArray.label]: ContentFieldArray.Component,
  [ContentFieldRecord.label]: ContentFieldRecord.Component,
  [ContentFieldString.label]: ContentFieldString.Component,
  [ContentFieldText.label]: ContentFieldText.Component,
  [ContentFieldRef.label]: ContentFieldRef.Component,
}
