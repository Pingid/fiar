import { IContentField, ContentFieldOptions, field } from '@fiar/content/schema'

export interface FieldImageOptions extends ContentFieldOptions<{ name: string; bucket: string; fullPath: string }> {}
export type FieldImage = IContentField<{ name: string; bucket: string; fullPath: string }, FieldImageOptions>

export const image = (options: Partial<FieldImageOptions>): FieldImage =>
  field({
    type: '{}',
    options: { component: 'content:field:asset-image', ...options, optional: !!options.optional },
    handle: async (_ctx, ev) => {
      if (ev.type !== 'publish') return ev
      if (!ev.value && !options.optional) return { valid: false, reason: 'Required value' }
      return ev
    },
  })
