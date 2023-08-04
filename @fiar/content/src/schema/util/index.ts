export type ID<T extends string> = symbol & { description: T }
export const id = <T extends string>(value: T) => Symbol(value) as ID<T>
