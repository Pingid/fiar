export const computed = Symbol('Security rule string')
export const type = Symbol()

export type RuleGroup = ['||', (string | Rule | RuleGroup)[]] | ['&&', (string | Rule | RuleGroup)[]]

export interface Rule<T = unknown> {
  readonly [type]?: T
  readonly [computed]: string | RuleGroup
}
