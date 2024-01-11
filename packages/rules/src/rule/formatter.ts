import { Formatter, format, isRule, isGroup, RuleGroup, Rule } from '.'

type FormatProps = { indent?: number | undefined; start?: number | undefined }

export const defaultFormatter = (props?: FormatProps): Formatter => {
  const start = props?.start || 6
  return (value) => {
    if (typeof value === 'undefined') return ''
    if (typeof value === 'string') return `'${value}'`
    if (typeof value === 'number') return `${value}`
    if (typeof value === 'boolean') return `${value}`
    if (value === null) return `null`

    const next = defaultFormatter({
      ...props,
      start: props?.indent ? start + props?.indent : undefined,
    })

    if (isRule(value)) return format(value, next)

    if (isGroup(value)) {
      const flattend = flattenGroup(value)
      const indent = props?.indent ? `\n${' '.repeat(start)}` : ''
      const prepend = props?.indent ? ` `.repeat(props?.indent) : ''
      const joined = flattend
        .map((x) => next(x))
        .filter(Boolean)
        .join(` ${value.join}${indent || ' '}`)
      return `${prepend}(${joined})`
    }

    if (Array.isArray(value)) return `[${value.map(next).join(`, `)}]`
    return JSON.stringify(value)
  }
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
