import { DocumentSnapshot, limit, QueryConstraint } from '@firebase/firestore'
import { createContext, useContext, useMemo } from 'react'
import { createStore, StoreApi } from 'zustand'

export interface QueryState {
  constraints: QueryConstraint[]
  constrain: (type: QueryConstraint['type'], to?: QueryConstraint) => void
  cursors: DocumentSnapshot[]
}

const QueryStateContext = createContext<StoreApi<QueryState> | null>(null)
export const QueryStateProvider = (props: { children: React.ReactNode }) => (
  <QueryStateContext.Provider value={useMemo(() => createQueryStore(), [])}>
    {props.children}
  </QueryStateContext.Provider>
)
export const useQueryStore = () => useContext(QueryStateContext)!

const createQueryStore = () =>
  createStore<QueryState>((set) => ({
    cursors: [],
    constraints: [limit(3)] as QueryConstraint[],
    constrain: (type, next) => {
      set((x) => {
        if (!next) return { constraints: x.constraints.filter((y) => y.type !== type) }
        const exists = x.constraints.some((y) => y.type === type)
        if (!exists) return { ...x, constraints: [...x.constraints, next] }
        return { ...x, constraints: x.constraints.map((y) => (y.type === type ? next : y)) }
      })
    },
  }))
