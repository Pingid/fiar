import {
  CollectionReference,
  collection,
  serverTimestamp,
  addDoc,
  getCountFromServer,
  getDocs,
  query,
  QueryConstraint,
  onSnapshot,
  FirestoreError,
  QuerySnapshot,
} from '@firebase/firestore'

import { DocumentVersions } from '../../document'
import { CollectionContext } from '../context'

export type CollectionActions = ReturnType<typeof createCollectionActions>
const metaKey = '_meta'

export const createCollectionActions = (ctx: CollectionContext) => ({
  count: count(ctx),
  refs: refs(ctx),
  add: add(ctx),
  get: get(ctx),
  on: on(ctx),
})

export const add = (ctx: CollectionContext) => async () => {
  const r = refs(ctx)
  const meta = await getMeta(ctx)
  return addDoc(r.draft, { [metaKey]: { created: meta, updated: meta } })
}

export const get =
  (ctx: CollectionContext) =>
  async <K extends keyof DocumentVersions>(version: K, constraints: QueryConstraint[]) =>
    getDocs(query(refs(ctx)[version], ...constraints))

export const on =
  (ctx: CollectionContext) =>
  <K extends keyof DocumentVersions>(
    version: K,
    constraints: QueryConstraint[],
    observer: {
      next?: (value: QuerySnapshot<DocumentVersions[K]>) => void
      error?: (error: FirestoreError) => void
      complete?: () => void
    },
  ) =>
    onSnapshot(query(refs(ctx)[version], ...constraints), observer as any)

export const count =
  (ctx: CollectionContext) =>
  async <K extends keyof DocumentVersions>(version: K) =>
    getCountFromServer(refs(ctx)[version]).then((x) => x.data())

const refs = (ctx: Omit<CollectionContext, 'user' | 'validate'>) => ({
  draft: collection(ctx.firestore, ctx.contentPrefix, 'draft', ctx.ref) as CollectionReference<
    DocumentVersions['draft']
  >,
  archive: collection(ctx.firestore, ctx.contentPrefix, 'archive', ctx.ref) as CollectionReference<
    DocumentVersions['archive']
  >,
  published: collection(ctx.firestore, ctx.ref) as CollectionReference<DocumentVersions['published']>,
})

const getMeta = (ctx: Pick<CollectionContext, 'user'>) =>
  Promise.resolve(ctx.user ? ctx.user() : undefined)
    .then((x) => x || null)
    .then((by) => ({ by, at: serverTimestamp() }))
