export interface AstNode {}
type Prop<T, K> = K extends keyof T ? T[K] : never

const helper =
  <K extends Ast['kind'], T extends Extract<Ast, { kind: K }>, const P extends ReadonlyArray<keyof T>>(
    kind: K,
    keys: P,
  ) =>
  (props: { -readonly [KN in keyof P]: Prop<T, P[KN]> }) => {
    return keys.reduce((a, b, i) => ({ ...a, [b]: props[i] }), { kind }) as T
  }

export interface RulesDeclartion extends AstNode {
  kind: 'RulesDeclartion'
  version?: Literal | undefined
  statements: (RulesServiceDeclartion | FunctionDeclaration | Comment | Empty)[]
}

export const rules = helper('RulesDeclartion', ['version', 'statements'])

export interface RulesServiceDeclartion extends AstNode {
  kind: 'RulesServiceDeclartion'
  service: string
  statements: (MatchDeclaration | FunctionDeclaration | Comment | Empty)[]
}

export const service = helper('RulesServiceDeclartion', ['service', 'statements'])

export interface MatchDeclaration extends AstNode {
  kind: 'MatchDeclaration'
  path: PathDeclaration
  statements: (AllowDeclaration | FunctionDeclaration | MatchDeclaration | Comment | Empty)[]
}
export const match = helper('MatchDeclaration', ['path', 'statements'])

export interface PathDeclaration extends AstNode {
  kind: 'PathDeclaration'
  segments: Segment[]
}
export const path = helper('PathDeclaration', ['segments'])

export interface Segment extends AstNode {
  kind: 'Segment'
  value: MemberExpression | Ident | CallExpression
  expression: boolean
}
export const segment = helper('Segment', ['expression', 'value'])

export interface AllowDeclaration extends AstNode {
  kind: 'AllowDeclaration'
  type: Ident[]
  statement?: Ast
}
export const allow = helper('AllowDeclaration', ['type', 'statement'])

export interface FunctionDeclaration extends AstNode {
  kind: 'FunctionDeclaration'
  name: Ident
  params: Ident[]
  body: (LetDeclaration | Comment | Empty | ReturnDecleration)[]
}
export const func = helper('FunctionDeclaration', ['name', 'params', 'body'])

export interface LetDeclaration extends AstNode {
  kind: 'LetDeclaration'
  key: Ident
  value: Value
}
export const func_let = helper('LetDeclaration', ['key', 'value'])

export interface ReturnDecleration extends AstNode {
  kind: 'ReturnDecleration'
  value: Value
}
export const func_return = helper('ReturnDecleration', ['value'])

// Values
export interface LogicalExpression extends AstNode {
  kind: 'LogicalExpression'
  operator: '||' | '&&'
  left: Value
  right: Value
}
export const logical = helper('LogicalExpression', ['left', 'operator', 'right'])

export interface Expression extends AstNode {
  kind: 'Expression'
  operator: string
  left: Value
  right: Value
  param: boolean
}
export const expression = helper('Expression', ['param', 'left', 'operator', 'right'])

export interface MemberExpression extends AstNode {
  kind: 'MemberExpression'
  object: Ident | Literal | MemberExpression | CallExpression | ObjectExpression | ArrayExpression
  property: Ident | Literal | MemberExpression | CallExpression
}

export const member = helper('MemberExpression', ['object', 'property'])

export interface CallExpression extends AstNode {
  kind: 'CallExpression'
  args: Value[]
  callee: Ident | MemberExpression | CallExpression
}
export const call = helper('CallExpression', ['callee', 'args'])

export interface ObjectExpression extends AstNode {
  kind: 'ObjectExpression'
  properties: Property[]
}
export const object = helper('ObjectExpression', ['properties'])

export interface Property extends AstNode {
  kind: 'Property'
  key: Literal
  value: Value
}

export const property = helper('Property', ['key', 'value'])

export interface ArrayExpression extends AstNode {
  kind: 'ArrayExpression'
  elements: Value[]
}
export const array = helper('ArrayExpression', ['elements'])

export interface UnaryExpression extends AstNode {
  kind: 'UnaryExpression'
  argument: Value
}
export const unary = helper('UnaryExpression', ['argument'])

export interface Literal extends AstNode {
  kind: 'Literal'
  value: string
}
export const literal = helper('Literal', ['value'])

export interface Ident extends AstNode {
  kind: 'Ident'
  name: string
}
export const ident = helper('Ident', ['name'])

export interface Comment extends AstNode {
  kind: 'Comment'
  value: string
}
export const comment = helper('Comment', ['value'])

export interface Empty extends AstNode {
  kind: 'Empty'
}
export const empty = helper('Empty', [])

export type Value =
  | PathDeclaration
  | Expression
  | MemberExpression
  | CallExpression
  | ObjectExpression
  | ArrayExpression
  | UnaryExpression
  | Literal
  | Ident

export type Ast =
  | RulesDeclartion
  | RulesServiceDeclartion
  | MatchDeclaration
  | PathDeclaration
  | Segment
  | AllowDeclaration
  | FunctionDeclaration
  | LetDeclaration
  | ReturnDecleration
  | LogicalExpression
  | Expression
  | MemberExpression
  | CallExpression
  | ObjectExpression
  | Property
  | ArrayExpression
  | UnaryExpression
  | Literal
  | Comment
  | Empty
  | Ident
