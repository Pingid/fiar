import type { IContentCollection, IContentDocument } from '../schema/index.js'
import type { FirebaseApp } from '@firebase/app'
import { create } from 'zustand'

export type ContentConfig = {
  firebase?: FirebaseApp
  collections?: IContentCollection[]
  documents?: IContentDocument[]
}

export const useContentConfig = create<ContentConfig>(() => ({}))
