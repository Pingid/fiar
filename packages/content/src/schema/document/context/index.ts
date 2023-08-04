import type { ContentContext } from '../../context'

import { IContentDocument } from '../types'

export type DocumentContext = ContentContext & {
  field: IContentDocument['field']
  ref: string
}
