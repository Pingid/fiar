import type { ContextFirestore } from './namespaces.js'
import type {
  FireModel,
  FireSchemaList,
  FireSchemaLiteral,
  FireSchemaMap,
  FireSchemaNumber,
  FireSchemaSet,
  FireSchemaString,
  FireSchemaUnion,
  FireSchemaTypes,
} from '@fiar/schema'
import { compute, op, rule } from './rules.js'
import { Rule, RuleGroup } from './base.js'
import { Operators } from './interfaces.js'

type RuleCreater<T extends FireSchemaTypes = FireSchemaTypes> = (
  path: string,
  field: T,
  context: { method: Methods; handlers?: Record<string, RuleCreater<any>> },
) => RuleGroup

type Methods = 'read' | 'write' | 'get' | 'list' | 'create' | 'update' | 'delete'

type RuleDef<T extends FireModel> =
  | ((props: ContextFirestore<any, T['path']>, model: Operators) => Rule)
  | boolean
  | string

export const createModelRules = <T extends FireModel>(model: T, rules: Partial<Record<Methods, RuleDef<T>>>) => {
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

export const strictModel = (model: FireModel, method: Methods) => {
  console.log(
    compute([
      '&&',
      Object.keys(model.fields).map((key) =>
        createFieldRules(`request.resource.data.${key}`, model.fields[key] as FireSchemaTypes, { method }),
      ),
    ]),
  )
  return compute([
    '&&',
    Object.keys(model.fields).map((key) =>
      createFieldRules(`request.resource.data.${key}`, model.fields[key] as FireSchemaTypes, { method }),
    ),
  ])
}
export const createFieldRules: RuleCreater = (path, field, ctx) => {
  const creaters = { ...defaultCreaters, ...ctx?.handlers } as Record<string, RuleCreater<any>>
  if (creaters[field.type]) return (creaters[field.type] as any)(path, field, ctx)
  return ['&&', [`${path} is ${field.type}`]]
}

const createRuleSet: RuleCreater<FireSchemaSet> = (path, field, ctx) => {
  return ['&&', field.of.map((x, i) => createFieldRules(`${path}[${i}]`, x, ctx))]
}

const createRuleList: RuleCreater<FireSchemaList> = (path, field) => {
  const all: RuleGroup[1] = [`${path} is ${field.type}`]
  if (field.max) all.push(`${path}.size() <= ${field.max}`)
  if (field.min) all.push(`${path}.size() >= ${field.min}`)
  if (field.size) all.push(`${path}.size() == ${field.size}`)
  return ['&&', all]
}

const createRuleNumber: RuleCreater<FireSchemaNumber> = (path, field) => {
  const all = [`${path} is ${field.type}`]
  if (field.max) all.push(`${path} <= ${field.max}`)
  if (field.min) all.push(`${path} >= ${field.min}`)
  return ['&&', all]
}

const createRuleString: RuleCreater<FireSchemaString> = (path, field) => {
  const all = [`${path} is ${field.type}`]
  if (field.match instanceof RegExp) all.push(`${path}.matches('${field.match.source}')`)
  if (typeof field.match === 'string') all.push(`${path}.matches('${field.match}')`)
  if (field.min) all.push(`${path}.size() >= ${field.min}`)
  if (field.max) all.push(`${path}.size() <= ${field.max}`)
  if (field.size) all.push(`${path}.size() == ${field.size}`)
  return ['&&', all]
}

const createRuleUnion: RuleCreater<FireSchemaUnion> = (path, field, ctx) => {
  return ['||', field.of.map((x: FireSchemaTypes) => createFieldRules(path, x, ctx))]
}

const createRuleLiteral: RuleCreater<FireSchemaLiteral> = (path, field) => {
  return ['&&', [`${path} in ${JSON.stringify(field.value)}`]]
}

const createRuleMap: RuleCreater<FireSchemaMap> = (path, field, ctx) => {
  const keys = Object.keys(field.fields)
  const rules: RuleGroup = ['&&', [`${path} is ${field.type}`]]

  if (!field.loose) rules[1].push(`${path}.keys().hasOnly(${JSON.stringify(keys)})`)

  for (let key of keys) {
    const fld = field.fields[key] as FireSchemaTypes
    rules[1].push(createFieldRules(`${path}.${key}`, fld, ctx))
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
