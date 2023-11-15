import { field, IContentField, ContentFieldOptions } from '../types/index.js'

export interface FieldRecordOptions<
  T extends Record<string, IContentField<any, any>> = Record<string, IContentField<any, any>>,
> extends ContentFieldOptions<{ [K in keyof T]: T[K]['infer'] }> {
  fields: T
}
export type FieldRecord<T extends Record<string, IContentField<any, any>> = Record<string, IContentField<any, any>>> =
  IContentField<{ [K in keyof T]: T[K]['infer'] }, FieldRecordOptions<{ [K in keyof T]: T[K]['infer'] }>>

export const record = <T extends Record<string, IContentField<any, any>>>(
  options: Pick<FieldRecordOptions<T>, 'fields'> & Partial<FieldRecordOptions<T>>,
): FieldRecord<T> =>
  field({
    type: '{}',
    options: { component: 'content:field:record', ...options, optional: !!options.optional },
    handle: async (ctx, ev) => {
      if (ev.type !== 'publish') return ev
      if (!ev.value && !options.optional) return { valid: false, reason: 'Required value' }
      const data = ev.value
      for (const key in options.fields) {
        const field = options.fields[key]!
        const result = await field.handle(ctx, { ...ev, value: ev.value?.[key] })
        if (result.valid === false) return result
        data[key] = result.value
      }
      return { ...ev, value: data }
    },
  })
