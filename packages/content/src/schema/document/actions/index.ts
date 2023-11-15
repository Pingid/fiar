import {
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@firebase/firestore'

import { DocumentContext } from '../context/index.js'
import { DocumentVersions } from '../types/index.js'

export type DocumentActions = ReturnType<typeof createDocumentActions>

export const createDocumentActions = (ctx: DocumentContext) => ({
  refs: documentRefs(ctx),
  create: create(ctx),
  read: read(ctx),
  on: on(ctx),
  status: status(ctx),
  update: update(ctx),
  remove: remove(ctx),
  publish: publish(ctx),
  unpublish: unpublish(ctx),
  archive: archive(ctx),
  unarchive: unarchive(ctx),
})

const metaKey = '_meta'

export const create = (ctx: Omit<DocumentContext, 'validate'>) => async () => {
  const r = documentRefs(ctx)
  const meta = await getMeta(ctx)
  return setDoc(r.draft, { [metaKey]: { created: meta, updated: meta } })
}

export const read =
  (ctx: DocumentContext) =>
  <K extends keyof DocumentVersions>(version: K) =>
    getDoc(documentRefs(ctx)[version]) as Promise<DocumentSnapshot<DocumentVersions[K]>>

export const update = (ctx: Omit<DocumentContext, 'validate'>) => async (updates: Record<string, any>) => {
  const r = documentRefs(ctx)
  const meta = await getMeta(ctx)
  return updateDoc(r.draft, { ...updates, [`${metaKey}.updated`]: meta })
}

export const remove = (ctx: Omit<DocumentContext, 'user' | 'validate'>) => () => {
  const r = documentRefs(ctx)
  return Promise.all([deleteDoc(r.published), deleteDoc(r.archive), deleteDoc(r.draft)]).then(() => {})
}

export const on =
  (ctx: DocumentContext) =>
  <K extends keyof DocumentVersions>(
    version: K,
    observer: {
      next?: (snapshot: DocumentSnapshot<DocumentVersions[K]>) => void
      error?: (error: FirestoreError) => void
    },
  ) =>
    onSnapshot(documentRefs(ctx)[version] as any, observer as any)

export const status = (_ctx?: any) => (doc: DocumentSnapshot<DocumentVersions['draft']>) => {
  const data = doc.data()
  if (!doc.exists()) return 'Missing'
  const published = data?.[metaKey]?.published
  const changes = (data?.[metaKey]?.updated?.at?.seconds || 0) >= (published?.at?.seconds || 1)
  return published ? (changes ? 'Changes' : 'Published') : 'Draft'
}

export const publish = (ctx: DocumentContext) => async () => {
  const r = documentRefs(ctx)
  const doc = await getDoc(r.draft)
  const data = doc.data() as Partial<DocumentVersions['draft']>
  if (!data || !doc.exists()) return Promise.reject(`Missing document ${r.draft.path}`)
  delete data[metaKey]
  const next = await ctx.field.handle(ctx, { type: 'publish', value: data, valid: true })
  if (next.valid === false) return Promise.resolve()
  await setDoc(r.published, next.value)
  const meta = await getMeta(ctx)
  await updateDoc(r.draft, { [`${metaKey}.published`]: meta })
}

export const unpublish = (ctx: Omit<DocumentContext, 'user' | 'validate'>) => async () => {
  const r = documentRefs(ctx)
  await deleteDoc(r.published)
  await updateDoc(r.draft, { [`${metaKey}.published`]: null })
}

export const archive = (ctx: Omit<DocumentContext, 'user' | 'validate'>) => async () => {
  const r = documentRefs(ctx)
  const doc = await getDoc(r.draft)
  const data = doc.data() as Partial<DocumentVersions['draft']>
  if (!data || !doc.exists()) return Promise.reject(`Missing document ${r.draft.path}`)
  await setDoc(r.archive, data)
  await deleteDoc(r.draft)
}

export const unarchive = (ctx: Omit<DocumentContext, 'user' | 'validate'>) => async () => {
  const r = documentRefs(ctx)
  const doc = await getDoc(r.archive)
  const data = doc.data() as Partial<DocumentVersions['draft']>
  if (!data || !doc.exists()) return Promise.reject(`Missing document ${r.draft.path}`)
  await setDoc(r.draft, data)
  await deleteDoc(r.archive)
}

const getMeta = (ctx: Pick<DocumentContext, 'user'>) =>
  Promise.resolve(ctx.user ? ctx.user() : undefined)
    .then((x) => x || null)
    .then((by) => ({ by, at: serverTimestamp() }))

export const documentRefs = (ctx: Pick<DocumentContext, 'ref' | 'firestore' | 'contentPrefix'>) => {
  return {
    draft: doc(ctx.firestore, ctx.contentPrefix, 'draft', ctx.ref) as DocumentReference<DocumentVersions['draft']>,
    archive: doc(ctx.firestore, ctx.contentPrefix, 'archive', ctx.ref) as DocumentReference<
      DocumentVersions['archive']
    >,
    published: doc(ctx.firestore, ctx.ref) as DocumentReference<DocumentVersions['published']>,
  }
}
