import { field, IContentField, ContentFieldOptions } from '../types/index.js'

export interface FieldArrayOptions<T extends IContentField<any, any> = IContentField<any, any>>
  extends ContentFieldOptions<T['infer'][]> {
  of: T
}
export type FieldArray<T extends IContentField<any, any> = IContentField<any, any>> = IContentField<
  T['infer'][],
  FieldArrayOptions<T>
>

export const array = <T extends IContentField<any, any> = IContentField<any, any>>(
  options: Pick<FieldArrayOptions<T>, 'of'> & Partial<FieldArrayOptions<T>>,
): FieldArray<T> =>
  field({
    type: '[]',
    options: { component: 'content:field:array', ...options, optional: !!options.optional },
    handle: async (ctx, ev) => {
      if (ev.type !== 'publish') return ev
      if (!ev.value && !options.optional) return { valid: false, reason: 'Required value' }
      const data = ev.value
      for (let i = 0; i < data.length; i++) {
        const result = await options.of.handle(ctx, { ...ev, value: data[i] })
        if (result.valid === false) return result
        data[i] = result.value
      }
      return { ...ev, value: data }
    },
  })
