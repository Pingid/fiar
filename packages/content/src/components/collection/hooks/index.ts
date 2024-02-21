import { collection, DocumentSnapshot, limit, orderBy, OrderByDirection, QueryConstraint } from '@firebase/firestore'
import { create } from 'zustand'

import { useCollectionData, useFirestore } from '../../../hooks/index.js'

export const useCollectionQuery = create<{
  pages: DocumentSnapshot[]
  constraints: QueryConstraint[]
  update: (type: QueryConstraint['type'], to?: QueryConstraint) => void
}>((set) => ({
  pages: [],
  constraints: [limit(3)] as QueryConstraint[],
  update: (type, next) => {
    set((x) => {
      if (!next) return { constraints: x.constraints.filter((y) => y.type !== type) }
      const exists = x.constraints.some((y) => y.type === type)
      if (!exists) return { ...x, constraints: [...x.constraints, next] }
      return { ...x, constraints: x.constraints.map((y) => (y.type === type ? next : y)) }
    })
  },
}))

export const useCollectionListData = (path: string) => {
  const firestore = useFirestore()
  const data = useCollectionQuery()
  return useCollectionData(collection(firestore, path), { constraints: data.constraints })
}

export const useOrderBy = (v: string) => {
  const value = useCollectionQuery((x) => x.constraints.find((y) => y.type === 'orderBy'))
  const update = useCollectionQuery((x) => x.update)
  const active = (value as any)?._field?.segments.join('.') === v
  const dir = (value as any)?._direction || ('desc' as OrderByDirection)
  const next = active ? (dir === 'asc' ? 'desc' : 'asc') : 'asc'
  const toggle = () => (update('orderBy', orderBy(v, next)), update('startAfter'))
  return [active, active ? dir : 'asc', toggle] as const
}
