import { Formatter, format, isRule, isGroup, RuleGroup, Rule } from './rule.js'

type FormatProps = { indent?: number; start?: number; del?: string }

export const defaultFormatter = (props?: FormatProps): Formatter => {
  const indent = props?.indent || 1
  const start = props?.start || 2
  const del = props?.del || '\t'

  const pad = (n: number) => del.repeat(n)

  const formatter =
    (props: Required<FormatProps> & { nested: boolean }): Formatter =>
    (value) => {
      if (typeof value === 'undefined') return ''
      if (typeof value === 'string') return `'${value}'`
      if (typeof value === 'number') return `${value}`
      if (typeof value === 'boolean') return `${value}`
      if (value === null) return `null`

      const next = formatter({
        ...props,
        nested: true,
        start: props.start + props?.indent,
      })

      if (isRule(value)) return format(value, formatter(props))

      if (isGroup(value)) {
        const flattend = flattenGroup(value)
        const indent = props?.indent ? `\n${pad(props.start)}` : ''
        const resolved = flattend.map((x) => next(x)).filter(Boolean)
        const joined = resolved.join(` ${value.join}${indent || ' '}`)
        if (props.nested) return `(${joined})`
        return joined
      }

      if (Array.isArray(value)) return `[${value.map(next).join(`, `)}]`
      return JSON.stringify(value)
    }

  return formatter({ start, del, indent, ...props, nested: false })
}

const flattenGroup = (group: RuleGroup): Rule[] =>
  group.items
    .map((x) => {
      if (isGroup(x)) {
        if (x.join === group.join) return flattenGroup(x)
        if (x.items.length === 1) return x.items
      }
      return [x]
    })
    .flat() as Rule[]
