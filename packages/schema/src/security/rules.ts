import { Rule, RuleGroup, computed } from './base.js'
import { Operators } from './interfaces.js'

const isRule = (x: unknown): x is Rule => !!(x && typeof (x as any)[computed] !== 'undefined')

const argToString = (value: unknown): string => {
  if (isRule(value)) return compute(value, 0)
  if (typeof value === 'number') return `${value}`
  if (typeof value === 'string') return `'${value}'`
  if (typeof value === 'boolean') return `${value}`
  if (value === null) return `null`
  if (Array.isArray(value)) return `[${value.map(argToString).join(`, `)}]`
  return JSON.stringify(value)
  throw new Error(`Unknown value ${JSON.stringify({ value })}`)
}

export const rule = <T>(accessor: string = ''): T => {
  return new Proxy((() => accessor) as any, {
    apply: (_a, _b, c) => rule(`${accessor}(${c.map(argToString).join(', ')})`),
    get: (_t, k) => {
      if (k === computed) return ['&&', [accessor]]
      if (typeof k !== 'string') throw new Error(`Unknown type accessor`)
      if (/^\d{1,}:\d{1,}$/.test(k)) return rule(`${accessor}[${k as any}]`)
      if (/^\d{1,}$/.test(k)) return rule(`${accessor}[${k as any}]`)
      return rule(`${accessor}${accessor ? '.' : ''}${k as string}`)
    },
  })
}

export const compute = <R extends Rule>(rule: R | string | RuleGroup, indent = 0) => {
  if (typeof rule === 'string') return rule
  if (isRule(rule)) return formatGroups(flattenGroup(rule[computed]), indent)
  return formatGroups(flattenGroup(rule), indent)
}

const flattenGroup = ([join, data]: RuleGroup): RuleGroup => {
  const groups = data.reduce<RuleGroup[1]>((a, b) => {
    if (Array.isArray(b) && b[0] === join) return [...a, ...b[0]]
    if (isRule(b) && Array.isArray(b[computed]) && b[computed][0] === join) return [...a, ...b[computed][1]]
    return [...a, b]
  }, [])
  return [join, groups]
}

export const formatGroups = ([join, data]: RuleGroup, indent = 1): string => {
  return data.reduce<string>((a, b) => {
    const init = a ? `${a} ${join}\n${'\t'.repeat(indent)}` : ''
    if (typeof b === 'string') return `${init}${b}`
    if (isRule(b)) return `${init}${compute(b, indent)}`
    if (b[1].length === 0) return a
    return `${init}(${formatGroups(b, indent + 1)})`
  }, '')
}

const opF = (div: string) => (a: any, b: any) =>
  ({ [computed]: ['&&', [`${argToString(a)} ${div} ${argToString(b)}`]] }) as any

export const op: Operators = {
  is: (a, type) => ({ [computed]: ['&&', [`${argToString(a)} is ${type}`]] }) as any,
  in: (a: any, b: any) => ({ [computed]: ['&&', [`${argToString(b)} in ${argToString(a)}`]] }) as any,
  and: (...args) => ({ [computed]: ['&&', args] }) as any,
  or: (...args) => ({ [computed]: ['||', args] }) as any,
  eq: opF('=='),
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
