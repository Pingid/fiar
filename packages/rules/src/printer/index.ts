import { AstPath, Doc, Options, Printer, doc, format } from 'prettier'

import { Ast } from '../ast/index.js'

export type RulesPrinter = Printer<Ast>

const b = doc.builders

const is = <K extends Ast['kind']>(path: AstPath<Ast>, kind: K): path is AstPath<Extract<Ast, { kind: K }>> =>
  path.node.kind === kind

const block = <K extends string, A extends { [L in K]: Array<Ast> }>(
  print: (path: AstPath<Ast>) => doc.builders.Doc,
  path: AstPath<A>,
  key: K,
) =>
  path.node[key].length > 0
    ? // @ts-ignore
      [' {', b.indent([b.hardline, b.join([b.hardline], path.map(print, key))]), b.hardline, '}']
    : [' {', b.line, '}']

export const print: RulesPrinter['print'] = (path, _options, print) => {
  const semi = ';'

  if (is(path, 'RulesDeclartion')) return b.join([b.hardline], path.map(print, 'statements'))
  if (is(path, 'RulesVersion')) return ['rules_version', ' = ', path.call(print, 'value'), semi]
  if (is(path, 'RulesServiceDeclartion')) return [`service ${path.node.service}`, block(print, path, 'statements')]
  if (is(path, 'MatchDeclaration')) return [`match `, path.call(print, 'path'), block(print, path, 'statements')]

  if (is(path, 'AllowDeclaration')) {
    const type = b.join([', '], path.map(print, 'type'))
    if (!path.node.statement) return [`allow `, type, semi]
    return [`allow `, type, ': if ', b.indent(path.call(print as any, 'statement')), semi]
  }

  if (is(path, 'FunctionDeclaration')) {
    const params = ['(', b.join([', '], path.map(print, 'params')), ')']
    return [`function ${path.node.name.name}`, params, block(print, path, 'body')]
  }

  if (is(path, 'ReturnDecleration')) return ['return ', b.indent(path.call(print, 'value')), semi]
  if (is(path, 'LetDeclaration')) return ['let ', path.call(print, 'key'), ' = ', path.call(print, 'value'), semi]
  if (is(path, 'CallExpression')) return [path.call(print, 'callee'), '(', b.join([', '], path.map(print, 'args')), ')']

  if (is(path, 'MemberExpression')) {
    if (path.node.computed) return [path.call(print, 'object'), '[', path.call(print, 'property'), ']']
    return [path.call(print, 'object'), '.', path.call(print, 'property')]
  }

  if (is(path, 'Expression')) {
    const comment: Doc[] = path.node.comment ? [path.call(print as any, 'comment'), b.hardline] : []

    const operator = ['&&', '||'].includes(path.node.operator)
      ? [b.line, comment, path.node.operator, ' ']
      : [' ', comment, path.node.operator, ' ']

    if (path.node.param) {
      return b.indent(b.group(['(', path.call(print, 'left'), operator, path.call(print, 'right'), ')']))
    }
    return b.group([path.call(print, 'left'), operator, path.call(print, 'right')])
  }

  if (is(path, 'ArrayExpression')) return b.group(['[', b.join([',', ' '], path.map(print, 'elements')), ']'])
  if (is(path, 'PathDeclaration')) return ['/', b.join(['/'], path.map(print, 'segments'))]
  if (is(path, 'Segment')) {
    if (path.node.expression) return ['$(', path.call(print, 'value'), ')']
    return path.call(print, 'value')
  }
  if (is(path, 'Comment')) {
    const flatten = path.node.value.split(/\n/).map((x) => x.trim())
    return b.join([b.hardline], flatten)
  }
  if (is(path, 'ObjectExpression')) {
    return b.group(['{', b.indent([b.line, b.join([',', b.line], path.map(print, 'properties'))]), b.line, '}'])
  }
  if (is(path, 'Property')) return [path.call(print, 'key'), ':', ' ', path.call(print, 'value')]
  if (is(path, 'UnaryExpression')) return ['!', path.call(print, 'argument')]
  if (is(path, 'Literal')) return path.node.value
  if (is(path, 'Ident')) return path.node.name
  if (is(path, 'Empty')) return ''

  console.log({ path }, path.node)
  throw new Error(`Missing ${path.node.kind}`)
  // return `${path.node.kind}`
}

// export const format = (ast: Ast.)

export const formatAst = (ast: Ast, options?: Options) =>
  format(`rules`, {
    filepath: 'rules.rules',
    ...options,
    plugins: [
      {
        languages: [{ name: 'Rules', parsers: ['rules'], extensions: ['.rules'] }],
        parsers: { rules: { astFormat: 'rules', locStart: () => 0, locEnd: () => 0, parse: () => ast } },
        printers: { rules: { print } },
      },
      ...(options?.plugins ?? []),
    ],
  })
