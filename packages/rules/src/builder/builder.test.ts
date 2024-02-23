import { expect, it, describe } from 'vitest'

import { formatAst } from '../_test/index.test.js'
import { output } from '../rule/index.js'
import { expression, operators } from './builder.js'

describe('expression builder', () => {
  const data = expression<any>()
  match(`data.b.c`, data.b.c)
  match(`data.b[1]`, data.b[1])
  match(`data("foo")`, data('foo'))
  match(`data.a.b("foo")`, data.a.b('foo'))
  match(`data.a.b(data.a.b)`, data.a.b(data.a.b))
  match(`data(null)`, data(null))
  match(`data(10)`, data(10))
  match(`data([])`, data([]))
  match(`data(["foo"])`, data(['foo']))
  match(`data({ one: data.a })`, data({ one: data.a }))
  match(`data(10, [1])`, data(10, [1]))
})

describe('operators', () => {
  const data = expression<any>()

  match(`data.a`, operators.and(data.a))
  match(`(data.a && data.b)`, operators.and(data.a, data.b))
  match(`(data.a && data.b && data.c)`, operators.and(data.a, data.b, data.c))
  match(`(data.a || data.b || data.c)`, operators.or(data.a, data.b, data.c))

  match(`data.a is string`, operators.is(data.a, 'string'))
  match(`data.a in ["foo", "bar"]`, operators.in(data.a, ['foo', 'bar']))
})

const match = (str: string, rule: any) => it(str, () => exp(rule).toBe(str))
const exp = (rule: any) => expect(formatAst(output(rule, { kind: 'Ident', name: 'data' }))).resolves
