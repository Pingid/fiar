import type { Plugin } from 'prettier'

import * as parser from './parser/index.js'
import * as printer from './print/index.js'
import type { Ast } from './parser/ast.js'

export type RulesPlugin = Plugin<Ast>

export const languages = [
  {
    name: 'Firestore',
    parsers: ['firestore'],
    extensions: ['.rules'],
    vscodeLanguageIds: ['firestore', 'firestorerules'],
  },
] satisfies Plugin['languages']

export const parsers = { firestore: parser } satisfies RulesPlugin['parsers']
export const printers = { firestore: printer } satisfies RulesPlugin['printers']

export default { languages, parsers, printers } satisfies RulesPlugin
