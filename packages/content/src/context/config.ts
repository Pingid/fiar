import type { IContentModel } from '../schema/index.js'
import type { FirebaseApp } from '@firebase/app'
import { create } from 'zustand'

export type ContentConfig = {
  app?: FirebaseApp
  content: IContentModel[]
}

export const useContentConfig = create<ContentConfig>(() => ({ content: [] }))
