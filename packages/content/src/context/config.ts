import type { FirebaseApp } from '@firebase/app'
import { Firestore } from '@firebase/firestore'
import { create } from 'zustand'

import type { IContentModel } from '../schema/index.js'

export type ContentConfig = {
  app?: FirebaseApp | undefined
  firestore?: Firestore | undefined
  models: IContentModel[]
}

export const useContentConfig = create<ContentConfig>(() => ({ models: [] }))
