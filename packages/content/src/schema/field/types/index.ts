import { FieldContext } from '../context/index.js'

export interface ContentFieldOptions<T = any> {
  label?: string
  optional: boolean
  component: string
  validate?: (value: T) => Promise<FieldValidation<T>> | FieldValidation<T>
}

export type ContentFieldEvents = 'publish' | 'get' | 'update'
export type FieldValidation<T> = { valid: true; value: T } | { valid: false; reason: string }
export type ContentFieldEventHandler<T> = <E extends ContentFieldEvents>(
  ctx: FieldContext,
  event: { value: T; valid: true; type: E },
) => Promise<FieldValidation<T>> | FieldValidation<T>

export interface IContentField<T extends any = any, O extends ContentFieldOptions<T> = ContentFieldOptions<T>> {
  // id: ID<'field'>
  type: 'string' | 'number' | 'boolean' | '{}' | '[]'
  infer: O['optional'] extends true ? T | undefined : T
  options: O
  handle: ContentFieldEventHandler<T>
}

export const field = <T extends any = any, O extends ContentFieldOptions<T> = ContentFieldOptions<T>>(
  p: Omit<IContentField<T, O>, 'infer' | 'options' | 'id'> & { options?: O },
): IContentField<T, O> => ({
  // id: id('field'),
  infer: undefined as any,
  options: undefined as any,
  ...p,
})
