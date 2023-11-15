import { DocumentSnapshot, FirestoreError } from '@firebase/firestore'
import { StoreApi, createStore } from 'zustand'
import { tp } from 'typeofit'

import { ContentFieldEventHandler, DocumentVersions, FieldValidation } from '../../../schema/index.js'
import { narrow, whenSubscribed } from '../../../util/zustand/index.js'
import { useContentVersion } from '../../version/index.js'
import { lense } from '../../../util/paths/index.js'
import { useDocument } from '../content/index.js'

export type DocumentStoreState = {
  synced: boolean
  loading: boolean
  missing: boolean
  title: string
  status: ReturnType<Exclude<ReturnType<typeof useDocument>, null | undefined>['status']>
  data: DocumentVersions['draft'] | null
  error: null | string
  update: (path: (string | number)[], value: any) => Promise<void>
  value: (path: (string | number)[]) => any
  onValue: (path: (string | number)[], cb: (x: unknown) => void) => () => void
  on: (path: (string | number)[], cb: ContentFieldEventHandler<any>) => () => undefined
  handler: ContentFieldEventHandler<any>
}

export const documentCache = new Map<string, Partial<typeof initial>>()

const initial = {
  synced: true,
  loading: true,
  missing: true,
  title: 'Untitled',
  status: '' as ReturnType<Exclude<ReturnType<typeof useDocument>, null | undefined>['status']>,
  data: null as DocumentVersions['draft'] | null,
  error: null as null | string,
}

export const createDocumentStore = ({
  doc,
  version,
}: {
  doc: Exclude<ReturnType<typeof useDocument>, null | undefined>
  version: Exclude<ReturnType<typeof useContentVersion>, null | undefined>
}) => {
  const handlers = new Set<ContentFieldEventHandler<any>>()
  const handler: ContentFieldEventHandler<any> = async (ctx, ev) => {
    return Array.from(handlers.values()).reduce<Promise<FieldValidation<any>>>(
      (a, b) => a.then((result) => (result.valid === false ? result : b(ctx, ev))),
      Promise.resolve(ev),
    )
  }

  const init = { ...initial, ...documentCache.get(doc.refs[version].path) }

  const store: StoreApi<DocumentStoreState> = createStore((_set, get) => ({
    ...init,
    update: (path: (string | number)[], value: any) => {
      const isArray = path.some((y) => tp.number(y))
      const last = lense.get(path.join('.'), get().data as any)
      if (last === value) return Promise.resolve()
      if (!isArray) return doc.update({ [path.join('.')]: value })
      const [first, rest] = splitArray(path)
      const data = lense.get(first.join('.'), get().data as any) || undefined
      return doc.update({ [first.join('.')]: lense.setNew(rest, data, value) })
    },
    value: (path: (string | number)[]) => lense.get<any>(path.join('.'), get().data as any),
    onValue: (path: (string | number)[], cb: (x: unknown) => void) =>
      narrow(store, (x) => lense.get(path.join('.'), x.data as any), cb),
    on: (path: (string | number)[], cb: ContentFieldEventHandler<any>) => {
      const wrapper: ContentFieldEventHandler<any> = (ctx, ev) =>
        cb(ctx, { ...ev, value: lense.get(path.join('.'), ev.value) })
      handlers.add(wrapper)
      return () => void handlers.delete(wrapper)
    },
    handler,
  }))

  whenSubscribed(store, () => {
    const next = (_doc: DocumentSnapshot<any>) => {
      const data = {
        title: doc.label(_doc.data()),
        data: _doc.data(),
        missing: !_doc.exists(),
        synced: !_doc.metadata.hasPendingWrites,
        status: doc.status(_doc),
        loading: false,
      } as const
      documentCache.set(doc.refs[version].path, data)
      store.setState(data)
    }
    store.setState({ loading: true })
    const error = (error: FirestoreError) => store.setState({ error: error.message })
    doc.read(version).then(next).catch(error)
    return doc.on(version, { next, error })
  })

  return store
}

const splitArray = (input: (number | string)[]): [string[], (number | string)[]] => {
  let index = 0
  while (index < input.length && typeof input[index] === 'string') {
    index++
  }
  return [input.slice(0, index) as string[], input.slice(index)]
}
