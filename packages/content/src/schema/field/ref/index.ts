import type { DocumentReference } from '@firebase/firestore'

import { field, IContentField, ContentFieldOptions } from '../types/index.js'
import { createDocumentActions } from '../../document/index.js'
import { IContentCollection } from '../../collection/index.js'

export interface FieldRefOptions<T extends IContentCollection<any, any>>
  extends ContentFieldOptions<DocumentReference<T['infer']>> {
  to: () => T
}
export type FieldRef<T extends IContentCollection = IContentCollection> = IContentField<
  DocumentReference<T['infer']>,
  FieldRefOptions<T>
>

export const ref = <T extends IContentCollection<any, any>>(
  options: Partial<FieldRefOptions<T>> & Pick<FieldRefOptions<T>, 'to'>,
): FieldRef<T> =>
  field({
    type: '{}',
    options: { component: 'content:field:ref', ...options, optional: !!options.optional },
    handle: async (ctx, ev) => {
      if (ev.type !== 'publish') return ev
      if (!ev.value && !options?.optional) return { valid: false, reason: 'Required value' }
      if (!ev.value) return ev
      const item = options.to()
      const actions = createDocumentActions({ ...ctx, ref: `${item.ref}/${ev.value.id}`, field: item.field })
      const status = actions.status(await actions.read('draft'))
      if (status !== 'Published') return { valid: false, reason: 'Not Published' }
      const next = actions.refs.published
      return { ...ev, valid: true, value: next }
    },
  })
