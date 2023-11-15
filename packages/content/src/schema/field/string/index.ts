import { field, IContentField, ContentFieldOptions } from '../types/index.js'

export interface FieldStringOptions extends ContentFieldOptions<string> {}
export type FieldString = IContentField<string, FieldStringOptions>
export const string = (options?: Partial<FieldStringOptions>): FieldString =>
  field<string, FieldStringOptions>({
    type: 'string',
    options: { component: 'content:field:string', ...options, optional: !!options?.optional },
    handle: async (_ctx, ev) => {
      if (ev.type !== 'publish') return ev
      if (!ev.value && !options?.optional) return { valid: false, reason: 'Required value' }
      if (options?.validate) return options.validate(ev.value)
      return { valid: true, value: ev.value || '' }
    },
  })
