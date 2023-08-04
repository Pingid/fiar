import type { ContentContext } from '../../context'
import { IContentCollection } from '../types'

export type CollectionContext = ContentContext & { ref: string; field: IContentCollection['field'] }
