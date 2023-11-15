import type { ContentContext } from '../../context/index.js'

import { IContentDocument } from '../types/index.js'

export type DocumentContext = ContentContext & {
  field: IContentDocument['field']
  ref: string
}
