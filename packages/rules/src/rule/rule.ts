const JOIN = Symbol()
const TYPE = Symbol()
const FORMAT = Symbol()

export interface Rule<T = unknown> {
  readonly [FORMAT]: (formatter: (value: RuleParams | undefined) => string) => string
  readonly [TYPE]: T
}

export type TypeOfRule<T extends Rule> = T[typeof TYPE]

export interface RuleGroup {
  readonly [JOIN]: typeof JOIN
  join: '&&' | '||'
  readonly items: (string | Rule<any> | RuleGroup)[]
}

export type RuleParams = RuleGroup | Rule<any> | boolean | number | string | null
export type Formatter = (value?: RuleParams) => string

export const isGroup = (x: unknown): x is RuleGroup => (x && (x as any)[JOIN]) === JOIN
export const isRule = (x: unknown): x is Rule => (x && (x as any)[TYPE]) === TYPE

export const format = (rule: Rule | RuleGroup, formatter: Formatter) => {
  if (isRule(rule)) return rule[FORMAT](formatter)
  return formatter(rule)
}

export const join = <K extends RuleGroup['join']>(j: K, items: RuleGroup['items']): RuleGroup => ({
  [JOIN]: JOIN,
  join: j,
  items,
})

export const rule = <T extends any = any>(handler?: (param: Formatter) => string): T => {
  function RULE(param: Formatter) {
    return handler ? handler(param) : ''
  }

  return new Proxy(RULE as any, {
    apply: (_a, _b, c) => rule((a) => `${RULE(a)}(${c.map(a).join(', ')})`),
    get: (_t, k) => {
      if (k === TYPE) return TYPE as any
      if (k === FORMAT) return (arg: any) => RULE(arg as Formatter)
      if (k === JOIN) return undefined

      if (typeof k !== 'string') throw new Error(`Unknown type accessor`)
      if (/^\d{1,}:\d{1,}$/.test(k)) return rule((a) => `${RULE(a)}[${k}]`)
      if (/^\d{1,}$/.test(k)) return rule((a) => `${RULE(a)}[${k}]`)
      return rule((a) => {
        const previous = RULE(a)
        return `${previous}${previous ? '.' : ''}${k}`
      })
    },
  })
}
