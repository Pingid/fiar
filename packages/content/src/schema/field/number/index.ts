import { field, IContentField, ContentFieldOptions } from '../types/index.js'

export interface FieldNumberOptions extends ContentFieldOptions<number> {}
export type FieldNumber = IContentField<number, FieldNumberOptions>
export const number = (options?: Partial<FieldNumberOptions>): FieldNumber =>
  field<number, FieldNumberOptions>({
    type: 'number',
    options: { component: 'content:field:number', ...options, optional: !!options?.optional },
    handle: async (_ctx, ev) => {
      if (ev.type !== 'publish') return ev
      if (!ev.value && !options?.optional) return { valid: false, reason: 'Required value' }
      if (options?.validate) return options.validate(ev.value)
      return { valid: true, value: ev.value }
    },
  })
