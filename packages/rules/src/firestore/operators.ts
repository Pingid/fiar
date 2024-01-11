import { RuleParams, join, rule } from '../rule/index.js'
import { Operators } from './interfaces.js'

const opF =
  <T extends any = any>(div: string) =>
  (a: RuleParams, b: RuleParams) =>
    rule<T>((gen) => `${gen(a)} ${div} ${gen(b)}`)

export const op: Operators = {
  is: (a, type) => rule((gen) => `${gen(a)} is ${type}`),
  and: (...args) => join('&&', args),
  or: (...args) => join('||', args),
  in: (a: any, b: any) => rule((gen) => `${gen(b)} in ${gen(a)}`),
  eq: opF('==') as any,
  neq: opF('!='),
  gt: opF('>'),
  lt: opF('<'),
  gte: opF('>='),
  lte: opF('<='),
  add: opF('+'),
  sub: opF('-'),
  div: opF('/'),
  mult: opF('*'),
  mod: opF('%'),
}
