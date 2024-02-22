import { expectEOF } from 'typescript-parsec'
import type { Plugin } from 'prettier'

import { print } from '../printer/index.js'
import { lexer } from '../parser/lexer.js'
import { parse } from '../parser/index.js'
import { Ast } from '../ast/index.js'

export type RulesPlugin = Plugin<Ast>

export const languages = [
  {
    name: 'Firestore',
    parsers: ['firestore'],
    extensions: ['.rules'],
    vscodeLanguageIds: ['firestore', 'firestorerules'],
  },
] satisfies Plugin['languages']

export const parsers = {
  firestore: {
    astFormat: 'firestore',
    locStart: () => 0,
    locEnd: () => 0,
    parse: (text, options) => {
      const parse_result = expectEOF(parse.parse(lexer.parse(text)))

      // console.log(literal.parse(lexer.parse(text)))
      if (parse_result.successful) {
        const ast = parse_result.candidates[0]?.result
        if (ast && parse_result.error && parse_result.error.message === 'Unable to consume token: <END-OF-FILE>')
          return ast
      }

      if (parse_result.error) {
        throw new Error(
          `${parse_result.error.message}\n${options.filepath}:${parse_result.error.pos?.rowBegin}:${parse_result.error.pos?.columnBegin} `,
        )
      }

      throw new Error(`Unable to parse rules`)
    },
  },
} satisfies RulesPlugin['parsers']

export const printers = { firestore: { print } } satisfies RulesPlugin['printers']

export default { languages, parsers, printers } satisfies RulesPlugin
