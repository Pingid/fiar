import { expectEOF } from 'typescript-parsec'
import { Parser } from 'prettier'

import { rules } from './parser'
import { lexer } from './lexer'
import { Ast } from './ast'

export type RulesParser = Parser<Ast>

export const astFormat = 'firestore'
export const locStart: RulesParser['locStart'] = () => {
  return 0
}
export const locEnd: RulesParser['locEnd'] = () => {
  return 0
}

export const parse: RulesParser['parse'] = (text, options) => {
  const parse_result = expectEOF(rules.parse(lexer.parse(text)))

  if (parse_result.successful) {
    const ast = parse_result.candidates[0]?.result
    if (ast && parse_result.error && parse_result.error.message === 'Unable to consume token: <END-OF-FILE>') return ast
  }

  if (parse_result.error) {
    throw new Error(
      `${parse_result.error.message}\n${options.filepath}:${parse_result.error.pos?.rowBegin}:${parse_result.error.pos?.columnBegin} `,
    )
  }

  throw new Error(`Unable to parse rules`)
}
