export interface RulesAstNode {}
type Prop<T, K> = K extends keyof T ? T[K] : never

const helper =
  <K extends Ast['kind'], T extends Extract<Ast, { kind: K }>, const P extends ReadonlyArray<keyof T>>(
    kind: K,
    keys: P,
  ) =>
  (props: { -readonly [KN in keyof P]: Prop<T, P[KN]> }) =>
    keys.reduce((a, b, i) => ({ ...a, [b]: props[i] }), { kind }) as T

export interface RulesDeclartion extends RulesAstNode {
  kind: 'RulesDeclartion'
  statements: (RulesVersion | RulesServiceDeclartion | FunctionDeclaration | Comment | Empty)[]
}

export const node = <T extends Ast>(x: T) => x

export const rules = helper('RulesDeclartion', ['statements'])

export interface RulesVersion extends RulesAstNode {
  kind: 'RulesVersion'
  value: Literal
}
export const version = helper('RulesVersion', ['value'])

export interface RulesServiceDeclartion extends RulesAstNode {
  kind: 'RulesServiceDeclartion'
  service: string
  statements: (MatchDeclaration | FunctionDeclaration | Comment | Empty)[]
}

export const service = helper('RulesServiceDeclartion', ['service', 'statements'])

export interface MatchDeclaration extends RulesAstNode {
  kind: 'MatchDeclaration'
  path: PathDeclaration
  statements: (AllowDeclaration | FunctionDeclaration | MatchDeclaration | Comment | Empty)[]
}
export const match = helper('MatchDeclaration', ['path', 'statements'])

export interface PathDeclaration extends RulesAstNode {
  kind: 'PathDeclaration'
  segments: Segment[]
}
export const path = helper('PathDeclaration', ['segments'])

export interface Segment extends RulesAstNode {
  kind: 'Segment'
  value: Value
  expression: boolean
}
export const segment = helper('Segment', ['expression', 'value'])

export interface AllowDeclaration extends RulesAstNode {
  kind: 'AllowDeclaration'
  type: Ident[]
  statement?: Value | undefined
}
export const allow = helper('AllowDeclaration', ['type', 'statement'])

export interface FunctionDeclaration extends RulesAstNode {
  kind: 'FunctionDeclaration'
  name: Ident
  params: Ident[]
  body: (LetDeclaration | Comment | Empty | ReturnDecleration)[]
}
export const func = helper('FunctionDeclaration', ['name', 'params', 'body'])

export interface LetDeclaration extends RulesAstNode {
  kind: 'LetDeclaration'
  key: Ident
  value: Value
}
export const func_let = helper('LetDeclaration', ['key', 'value'])

export interface ReturnDecleration extends RulesAstNode {
  kind: 'ReturnDecleration'
  value: Value
}
export const func_return = helper('ReturnDecleration', ['value'])

// Values
export interface LogicalExpression extends RulesAstNode {
  kind: 'LogicalExpression'
  operator: '||' | '&&'
  left: Value
  right: Value
}
export const logical = helper('LogicalExpression', ['left', 'operator', 'right'])

export interface Expression extends RulesAstNode {
  kind: 'Expression'
  operator: string
  left: Value
  right: Value
  param: boolean
  comment?: Comment | undefined
}
export const expression = helper('Expression', ['param', 'left', 'comment', 'operator', 'right'])

export interface MemberExpression extends RulesAstNode {
  kind: 'MemberExpression'
  object: Ident | Literal | MemberExpression | CallExpression | ObjectExpression | ArrayExpression
  property: Value
  computed: boolean
}

export const member = helper('MemberExpression', ['object', 'computed', 'property'])

export interface CallExpression extends RulesAstNode {
  kind: 'CallExpression'
  args: Value[]
  callee: Ident | MemberExpression | CallExpression
}
export const call = helper('CallExpression', ['callee', 'args'])

export interface ObjectExpression extends RulesAstNode {
  kind: 'ObjectExpression'
  properties: Property[]
}
export const object = helper('ObjectExpression', ['properties'])

export interface Property extends RulesAstNode {
  kind: 'Property'
  key: Literal
  value: Value
}

export const property = helper('Property', ['key', 'value'])

export interface ArrayExpression extends RulesAstNode {
  kind: 'ArrayExpression'
  elements: Value[]
}
export const array = helper('ArrayExpression', ['elements'])

export interface UnaryExpression extends RulesAstNode {
  kind: 'UnaryExpression'
  argument: Value
}
export const unary = helper('UnaryExpression', ['argument'])

export interface Literal extends RulesAstNode {
  kind: 'Literal'
  value: string
}
export const literal = helper('Literal', ['value'])

export interface Ident extends RulesAstNode {
  kind: 'Ident'
  name: string
}
export const ident = helper('Ident', ['name'])

export interface Comment extends RulesAstNode {
  kind: 'Comment'
  value: string
}
export const comment = helper('Comment', ['value'])

export interface Empty extends RulesAstNode {
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
  | RulesVersion
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
