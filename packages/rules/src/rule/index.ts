import type * as ast from '../ast/index.js'

const OUTPUT = Symbol('Rule Builder')
const TYPE = Symbol('Type Brand')

export type TypeOfRule<T extends Rule> = T[typeof TYPE]

export interface Rule<T = unknown> {
  readonly [OUTPUT]: (left?: ast.Ast) => ast.Ast
  readonly [TYPE]: T
}

export const output = (x: Rule<any>, left?: ast.Ast) => x[OUTPUT](left)
export const rule = <T extends Rule<any>>(cb: (input: ast.Ast) => ast.Ast) => ({ [OUTPUT]: cb }) as T
export const isRule = (x: unknown): x is Rule<any> => !!x && typeof (x as any)[OUTPUT] === 'function'
