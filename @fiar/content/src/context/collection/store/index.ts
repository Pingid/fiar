import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  QueryConstraint,
  QueryDocumentSnapshot,
  QuerySnapshot,
  limit,
  orderBy,
  startAfter,
} from '@firebase/firestore'
import { StoreApi, createStore } from 'zustand'
import { tp } from 'typeofit'

import { narrow, whenSubscribed } from '../../../util/zustand'

type Props = {
  add: () => Promise<DocumentReference>
  delete: (id: string) => Promise<any>
  get: (...constraints: QueryConstraint[]) => Promise<QuerySnapshot<any, any>>
  on?: (
    constraints: QueryConstraint[],
    observer: {
      next?: (value: QuerySnapshot<any>) => void
      error?: (error: FirestoreError) => void
      complete?: () => void
    },
  ) => () => void
}

const initial = {
  error: null as null | string,
  limit: 6,
  total: 0,
  page: 0,
  pages: [] as {
    docs: Array<QueryDocumentSnapshot<any>>
    loading: boolean
    marker?: DocumentSnapshot
    last?: boolean
  }[],
  order_by: ['_meta.created.at', 'desc'] as [string, 'asc' | 'desc'],
}

type CollectioStoreState = typeof initial & {
  prev_page: () => void
  next_page: () => Promise<void>
  add_doc: () => Promise<DocumentReference<any, any>>
  remove_doc: (id: string) => Promise<void>
}

export const createCollectionStore = (p: Props) => {
  const constraints = (s: typeof initial, ref?: DocumentSnapshot) =>
    [orderBy(...s.order_by), limit(s.limit), ref ? startAfter(ref) : undefined].filter(tp.defined)

  const on_error = (e: FirestoreError) => {
    store.setState({ error: e.message })
    console.error(e)
    // toast.error(e.message)
    return Promise.reject(e)
  }

  const on_page = (page: QuerySnapshot<DocumentData>, index: number) =>
    store.setState((state) => {
      const data = [...state.pages]
      data[index] = { ...data[index], loading: false, docs: page.docs, last: page.docs.length < state.limit }
      return { pages: data }
    })

  const add_doc = (): Promise<DocumentReference<any, any>> => {
    return p
      .add()
      .then((x) => {
        const state = store.getState()
        store.setState({ pages: state.pages.slice(0, state.page + 1) })
        return state.pages
          .reduce(
            (a, _b, index) =>
              a.then((marker) =>
                p.get(...constraints(store.getState(), marker)).then((page) => {
                  on_page(page, index)
                  return page.docs[page.docs.length - 1]
                }),
              ),
            Promise.resolve<any>(undefined),
          )
          .then(() => x)
      })
      .catch(on_error)
  }

  const remove_doc = (id: string) =>
    p
      .delete(id)
      .then(() => {
        return store.setState((x) => {
          const current = x.pages[x.page]
          if (!current) return x
          const page = { ...current, docs: current.docs.filter((y) => y.id !== id) }
          return { pages: [...x.pages.slice(0, x.page), page] }
        })
      })
      .catch(on_error)

  const prev_page = () => store.setState((x) => ({ page: Math.max(x.page - 1, 0) }))

  const next_page = () => {
    const state = store.getState()
    const data = [...state.pages]
    const next = state.page + 1
    if (next === state.page) return Promise.resolve()
    if (data[next]) return Promise.resolve(store.setState({ page: next }))

    const current = data[state.page]
    if (!current) return Promise.resolve()

    const marker = current.docs[current.docs.length - 1]
    if (!marker?.ref) return Promise.resolve()
    data[next] = { loading: true, docs: [], marker }
    store.setState({ pages: data, page: next })
    return p
      .get(...constraints(state, marker))
      .then((query) => on_page(query, next))
      .catch(on_error)
  }

  const store: StoreApi<CollectioStoreState> = createStore<CollectioStoreState>(() => ({
    ...initial,
    prev_page,
    next_page,
    add_doc,
    remove_doc,
  }))

  whenSubscribed(store, () => {
    store.setState({ pages: [{ loading: true, docs: [] }] })
    p.get(...constraints(store.getState()))
      .then((query) => on_page(query, 0))
      .catch(on_error)

    return () => {}
  })

  let unsubs: (() => void)[] = []
  const onDocs = p.on
  if (onDocs) {
    narrow(
      store,
      (x) => x.pages.length,
      () => {
        const state = store.getState()
        unsubs.forEach((fn) => fn())
        unsubs = state.pages.map((y, index) => {
          return onDocs(constraints(state, y.marker), {
            next: (page) => on_page(page, index),
            error: (e) => on_error(e),
          })
        })
      },
    )
  }

  return store
}
