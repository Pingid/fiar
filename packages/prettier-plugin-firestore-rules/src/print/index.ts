import { AstPath, Printer, doc } from 'prettier'

import { Ast } from '../parser/ast.js'

export type RulesPrinter = Printer<Ast>

const b = doc.builders

const is = <K extends Ast['kind']>(path: AstPath<Ast>, kind: K): path is AstPath<Extract<Ast, { kind: K }>> =>
  path.node.kind === kind

export const print: RulesPrinter['print'] = (path, _options, print) => {
  const semi = _options.semi ? ';' : ''

  if (is(path, 'RulesDeclartion')) {
    const results = []
    if (path.node.version) results.push(`rules_version = ${path.call(print as any, 'version')}`, b.hardline)
    return [...results, b.join([b.hardline], path.map(print, 'statements'))]
  }

  if (is(path, 'RulesServiceDeclartion')) {
    return [
      `service ${path.node.service} {`,
      b.indent([b.hardline, b.join([b.hardline], path.map(print, 'statements'))]),
      b.hardline,
      '}',
    ]
  }

  if (is(path, 'MatchDeclaration')) {
    const line_after = path.next ? b.hardline : ''
    return [
      `match `,
      path.call(print, 'path'),
      ' {',
      b.indent([b.hardline, b.join([b.hardline], path.map(print, 'statements'))]),
      b.hardline,
      '}',
      line_after,
    ]
  }

  if (is(path, 'AllowDeclaration')) {
    if (!path.node.statement) return [`allow `, b.join([', '], path.map(print, 'type')), semi]
    return [
      `allow `,
      b.join([', '], path.map(print, 'type')),
      ': if ',
      b.indent(path.call(print as any, 'statement')),
      semi,
    ]
  }

  if (is(path, 'FunctionDeclaration')) {
    const line_before = !['FunctionDeclaration', 'Comment'].includes(path.previous?.kind || '') ? b.hardline : ''
    const line_after = path.next ? b.hardline : ''
    return [
      line_before,
      `function ${path.node.name.name}`,
      '(',
      b.join([', '], path.map(print, 'params')),
      ') ',
      b.indent([
        '{',
        b.hardline,
        path.map(print, 'variables').map((x) => [x, b.hardline]),
        `return `,
        b.indent(path.call(print, 'out')),
        ';',
      ]),
      b.hardline,
      '}',
      line_after,
    ]
  }

  if (is(path, 'LetDeclaration')) {
    return ['let ', path.call(print, 'key'), ' = ', path.call(print, 'value'), ';']
  }

  if (is(path, 'CallExpression')) {
    return [path.call(print, 'callee'), '(', b.join([', '], path.map(print, 'args')), ')']
  }

  if (is(path, 'MemberExpression')) {
    if (path.node.property.kind === 'Literal') {
      return [path.call(print, 'object'), '[', path.call(print, 'property'), ']']
    }
    return [path.call(print, 'object'), '.', path.call(print, 'property')]
  }

  if (is(path, 'Ident')) {
    return path.node.name
  }

  if (is(path, 'Literal')) {
    return path.node.value
  }

  if (is(path, 'Expression')) {
    const n = ['&&', '||'].includes(path.node.operator) ? b.line : ' '
    if (path.node.param) {
      return b.indent(
        b.group(['(', path.call(print, 'left'), ' ', path.node.operator, n, path.call(print, 'right'), ')']),
      )
    }
    return b.group([path.call(print, 'left'), ' ', path.node.operator, n, path.call(print, 'right')])
  }

  if (is(path, 'ArrayExpression')) {
    return b.group(['[', b.join([', '], path.map(print, 'elements')), ']'])
  }

  if (is(path, 'PathDeclaration')) {
    return ['/', b.join(['/'], path.map(print, 'segments'))]
  }
  if (is(path, 'Segment')) {
    if (path.node.expression) return ['$(', path.call(print, 'value'), ')']
    return path.call(print, 'value')
  }
  if (is(path, 'Comment')) {
    return b.join(
      [b.hardline],
      path.node.value.split(/\n/).map((x) => x.trim()),
    )
  }
  if (is(path, 'UnaryExpression')) {
    return ['!', path.call(print, 'argument')]
  }
  if (is(path, 'ObjectExpression')) {
    return b.group(['{', b.indent([b.line, b.join([',', b.line], path.map(print, 'properties'))]), b.line, '}'])
  }
  if (is(path, 'Property')) {
    return [path.call(print, 'key'), ': ', path.call(print, 'value')]
  }
  throw new Error(`Missing ${path.node.kind}`)
  // return `${path.node.kind}`
}
