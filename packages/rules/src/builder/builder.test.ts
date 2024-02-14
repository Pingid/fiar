import { expect, test, describe } from 'vitest'

import { InferRule } from '../firestore/interfaces.js'
import { builder, op } from './index.js'
import { output } from '../rule/index.js'

test('cool', async () => {
  type Test = {
    one: (a: number, b: number) => { one: string }
    two: { three: 10 }
    four: 'haha'
    a: boolean
    b: boolean
  }
  // const b = builder<InferRule<Test>>()
  // console.log(output({ kind: 'Ident', name: 'data' }, op.eq(b.a, b.b)))
})
