import type { ContentContext } from '../../context/index.js'
import { IContentCollection } from '../types/index.js'

export type CollectionContext = ContentContext & { ref: string; field: IContentCollection['field'] }
