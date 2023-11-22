import type { ContextFirestore } from '../security/namespaces.js'
import type { IModel } from './model.js'
import type {
  IField,
  IFieldList,
  IFieldLiteral,
  IFieldMap,
  IFieldNumber,
  IFieldSet,
  IFieldString,
  IFieldUnion,
  IFields,
} from './fields.js'
import { compute, op, rule } from '../security/rules.js'
import { Rule, RuleGroup } from '../security/base.js'
import { Operators } from '../security/interfaces.js'

type RuleCreater<T extends IField<any> = IFields> = (
  path: string,
  field: T,
  context: { method: Methods; handlers?: Record<string, RuleCreater<any>> },
) => RuleGroup

type Methods = 'read' | 'write' | 'get' | 'list' | 'create' | 'update' | 'delete'

type RuleDef<T extends IModel> =
  | ((props: ContextFirestore<T['infer'], T['path']>, model: Operators) => Rule)
  | boolean
  | string

export const createModelRules = <T extends IModel>(model: T, rules: Partial<Record<Methods, RuleDef<T>>>) => {
  let ruleDef = `match ${model.path} {`
  const indent = `  `
  for (let key in rules) {
    const value = rules[key as keyof typeof rules]
    if (typeof value === 'string') ruleDef += `\n${indent}allow ${key}: if ${value};`
    if (typeof value === 'boolean') ruleDef += `\n${indent}allow ${key}: if ${value};`
    if (typeof value === 'function') {
      let result = value(rule(''), op)
      if (typeof result === 'string') ruleDef += `\n${indent}allow ${key}: if ${result};`
      if (typeof result === 'boolean') ruleDef += `\n${indent}allow ${key}: if ${result};`
      else ruleDef += `\n${indent}allow ${key}: if ${compute(result as any, 1)};`
    }
  }
  ruleDef += `\n}`
  return ruleDef
}

export const strictModel = (model: IModel, method: Methods) =>
  compute([
    '&&',
    Object.keys(model.fields).map((key) =>
      createFieldRules(`request.resource.data.${key}`, model.fields[key] as IField<any, any>, { method }),
    ),
  ])

export const createFieldRules: RuleCreater = (path, field, ctx) => {
  const creaters = { ...defaultCreaters, ...ctx?.handlers } as Record<string, RuleCreater<any>>
  if (creaters[field.type]) return (creaters[field.type] as any)(path, field, ctx)
  return ['&&', [`${path} is ${field.type}`]]
}

const createRuleSet: RuleCreater<IFieldSet<ReadonlyArray<IFields>>> = (path, field, ctx) => {
  return ['&&', field.of.map((x, i) => createFieldRules(`${path}[${i}]`, x, ctx))]
}

const createRuleList: RuleCreater<IFieldList<IFields>> = (path, field) => {
  const all: RuleGroup[1] = [`${path} is ${field.type}`]
  if (field.max) all.push(`${path}.size() <= ${field.max}`)
  if (field.min) all.push(`${path}.size() >= ${field.min}`)
  if (field.size) all.push(`${path}.size() == ${field.size}`)
  return ['&&', all]
}

const createRuleNumber: RuleCreater<IFieldNumber> = (path, field) => {
  const all = [`${path} is ${field.type}`]
  if (field.max) all.push(`${path} <= ${field.max}`)
  if (field.min) all.push(`${path} >= ${field.min}`)
  return ['&&', all]
}

const createRuleString: RuleCreater<IFieldString> = (path, field) => {
  const all = [`${path} is ${field.type}`]
  if (field.match instanceof RegExp) all.push(`${path}.matches('${field.match.source}')`)
  if (typeof field.match === 'string') all.push(`${path}.matches('${field.match}')`)
  if (field.min) all.push(`${path}.size() >= ${field.min}`)
  if (field.max) all.push(`${path}.size() <= ${field.max}`)
  if (field.size) all.push(`${path}.size() == ${field.size}`)
  return ['&&', all]
}

const createRuleUnion: RuleCreater<IFieldUnion<any>> = (path, field, ctx) => {
  return ['||', field.of.map((x: IFields) => createFieldRules(path, x, ctx))]
}

const createRuleLiteral: RuleCreater<IFieldLiteral<any>> = (path, field) => {
  return ['&&', [`${path} in ${JSON.stringify(field.of)}`]]
}

const createRuleMap: RuleCreater<IFieldMap<any, any>> = (path, field, ctx) => {
  const required_keys = Object.keys(field.required)
  const optional_keys = Object.keys(field.optional)
  const allKeys = [...required_keys, ...optional_keys]
  const rules: RuleGroup = ['&&', [`${path} is ${field.type}`]]

  if (!field.loose) rules[1].push(`${path}.keys().hasOnly(${JSON.stringify(allKeys)})`)

  if (required_keys.length > 0) {
    rules[1].push(`${path}.keys().hasAll(${JSON.stringify(required_keys)})`)
    required_keys.forEach((key) => {
      const fld = field.required[key] as IFields
      rules[1].push(createFieldRules(`${path}.${key}`, fld, ctx))
    })
  }

  if (optional_keys.length > 0) {
    optional_keys.forEach((key) => {
      const fld = field.optional[key] as IFields
      rules[1].push(['||', [`${path}.get('${key}', null) == null`, createFieldRules(`${path}.${key}`, fld, ctx)]])
    })
  }

  return rules
}

const defaultCreaters = {
  set: createRuleSet,
  list: createRuleList,
  number: createRuleNumber,
  string: createRuleString,
  union: createRuleUnion,
  literal: createRuleLiteral,
  map: createRuleMap,
}
