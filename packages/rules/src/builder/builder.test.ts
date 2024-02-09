import { expect, test, describe } from 'vitest'
import { builder, resultAst } from './index.js'

test('cool', () => {
  type Test = {
    one: (a: number, b: number) => { one: string }
    two: { three: 10 }
    four: 'haha'
  }
  const b = builder<Test>()
  console.log(resultAst(b.two.three, { kind: 'Ident', name: 'data' }))
})
