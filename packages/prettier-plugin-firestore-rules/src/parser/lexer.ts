import { buildLexer } from 'typescript-parsec'

export enum Tok {
  Null = 'Null',
  Bool = 'Bool',
  Num = 'Num',
  Str = 'Str',

  Dot = 'Dot',
  Coma = 'Coma',
  Colon = 'Colon',
  Semi = 'Semi',
  Pound = 'Pound',
  Eq = 'Eq',

  Op = 'Op',

  Unary = 'Unary',

  LCurly = 'LCurly',
  RCurly = 'RCurly',
  LBrack = 'LBrack',
  RBrack = 'RBrack',
  LSquare = 'LSquare',
  RSquare = 'RSquare',

  Comment = 'Comment',
  Empty = 'Empty',

  Ident = 'Ident',
  Space = 'Space',
}

const logical = ['&&', '||', '==', '!=', '>', '>=', '<', '<=', '+', '-', '*', '/', '%']
const reserved = ['is', 'in']
export const operators = [...reserved, ...logical]

export const lexer = buildLexer<Tok>([
  [true, /^null/g, Tok.Null],
  [true, /^(true|false)/g, Tok.Bool],
  [true, /^-?\d+(\.\d+)?/g, Tok.Num],
  [true, /^('|")[^'"]*('|")/g, Tok.Str],

  [true, /^\./g, Tok.Dot],
  [true, /^\,/g, Tok.Coma],
  [true, /^\:/g, Tok.Colon],
  [true, /^\;/g, Tok.Semi],
  [true, /^\$/g, Tok.Pound],
  [true, /^\=/g, Tok.Eq],

  [true, /^\/\/.*/g, Tok.Comment],
  [true, /^\/\*[\s\S]*?\*\//g, Tok.Comment],

  ...reserved.map((x) => [true, new RegExp(`^${x}`, 'g'), Tok.Op] as [boolean, RegExp, Tok]),
  ...logical.map((x) => [true, new RegExp(`^\\${x.split('').join('\\')}`, 'g'), Tok.Op] as [boolean, RegExp, Tok]),

  [true, /^\!/g, Tok.Unary],

  [true, /^\{/g, Tok.LCurly],
  [true, /^\}/g, Tok.RCurly],
  [true, /^\(/g, Tok.LBrack],
  [true, /^\)/g, Tok.RBrack],
  [true, /^\[/g, Tok.LSquare],
  [true, /^\]/g, Tok.RSquare],

  [true, /^[a-zA-Z_][a-zA-Z0-9_]*/g, Tok.Ident],

  [false, /^\s/g, Tok.Space],
  [false, /^\n/g, Tok.Space],
])
