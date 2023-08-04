import { field, IContentField, ContentFieldOptions } from '../types'

export interface FieldTextOptions extends ContentFieldOptions<string> {}
export type FieldText = IContentField<string, FieldTextOptions>
export const text = (options?: Partial<FieldTextOptions>): FieldText =>
  field<string, FieldTextOptions>({
    type: 'string',
    options: { component: 'content:field:text', ...options, optional: !!options?.optional },
    handle: async (_ctx, ev) => {
      if (ev.type !== 'publish') return ev
      if (!ev.value && !options?.optional) return { valid: false, reason: 'Required value' }
      if (options?.validate) return options.validate(ev.value)
      return { valid: true, value: ev.value || '' }
    },
  })
