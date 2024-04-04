import type { IContentModel } from '../schema/index.js'
import type { FirebaseApp } from '@firebase/app'
import { create } from 'zustand'

export type ContentConfig = {
  app?: FirebaseApp
  models: IContentModel[]
}

export const useContentConfig = create<ContentConfig>(() => ({ models: [] }))
