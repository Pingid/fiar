export const computed = Symbol('Security rule string')
export const type = Symbol()

export type RuleGroup = ['||', (string | Rule | RuleGroup)[]] | ['&&', (string | Rule | RuleGroup)[]]

export interface Rule<T = unknown> {
  readonly [computed]: RuleGroup
  readonly [type]: T
}

export const isRule = (x: unknown): x is Rule => x && (x as any)[computed]
