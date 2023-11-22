import { type QueryDocumentSnapshot } from '@firebase/firestore'
import { create } from 'zustand'

export const useCollectionListState = create(() => ({
  size: 10,
  pages: [] as QueryDocumentSnapshot[],
}))
