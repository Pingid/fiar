import { it, expect } from 'vitest'
import { format } from 'prettier'

import { print } from '../printer/index.js'
import plugin from '../plugin/index.js'
import { Ast } from '../ast/index.js'

it('should format ast', () => {
  expect(formatAst({ kind: 'Ident', name: 'data' })).resolves.toBe('data')
})

export const formatAst = (ast: Ast) =>
  format(`nothing`, {
    filepath: 'test.test',
    printWidth: 900,
    singleQuote: true,
    plugins: [
      plugin,
      {
        languages: [{ name: 'Test', parsers: ['test'], extensions: ['.test'] }],
        parsers: { test: { astFormat: 'test', locStart: () => 0, locEnd: () => 0, parse: () => ast } },
        printers: { test: { print } },
      },
    ],
  })
