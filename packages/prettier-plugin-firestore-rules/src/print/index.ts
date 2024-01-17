import { AstPath, Printer, doc } from 'prettier'

import { Ast } from '../parser/ast.js'

export type RulesPrinter = Printer<Ast>

const b = doc.builders

const is = <K extends Ast['kind']>(path: AstPath<Ast>, kind: K): path is AstPath<Extract<Ast, { kind: K }>> =>
  path.node.kind === kind

export const print: RulesPrinter['print'] = (path, _options, print) => {
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
    return [
      `match ${path.node.path.path} {`,
      b.indent([b.hardline, b.join([b.hardline], path.map(print, 'statements'))]),
      b.hardline,
      '}',
    ]
  }

  if (is(path, 'AllowDeclaration')) {
    return [`allow `, path.call(print, 'type'), ': if ', b.indent(path.call(print, 'statement'))]
  }

  if (is(path, 'FunctionDeclaration')) {
    return [
      `function ${path.node.name.name}`,
      '(',
      b.join([',', b.line], path.map(print, 'params')),
      ') {',
      b.indent([b.hardline, `return`, ' ', b.indent(path.call(print, 'out'))]),
      b.hardline,
      '}',
    ]
  }

  if (is(path, 'CallExpression')) {
    return [path.call(print, 'callee'), '(', b.join([',', b.line], path.map(print, 'args')), ')']
  }

  if (is(path, 'MemberExpression')) {
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
      console.log({
        op: path.node.operator,
        left: [
          (path.node.left as any)?.operator,
          (path.node.left as any)?.left?.kind,
          ((path.node.left as any)?.right as any)?.kind,
        ],
        right: [
          (path.node.right as any)?.operator,
          (path.node.right as any)?.left?.kind,
          ((path.node.right as any)?.right as any)?.kind,
        ],
      })
      return b.indent(
        b.group(['(', path.call(print, 'left'), ' ', path.node.operator, n, path.call(print, 'right'), ')']),
      )
    }
    return b.group([path.call(print, 'left'), ' ', path.node.operator, n, path.call(print, 'right')])
  }

  if (is(path, 'ArrayExpression')) {
    return b.group(['[', b.join([', '], path.map(print, 'elements')), ']'])
  }

  return `${path.node.kind}`
}
