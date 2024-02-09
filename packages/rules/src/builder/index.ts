import * as ast from '../ast/index.js'

const BRAND = Symbol('Rule Builder')
const OUTPUT = Symbol('Rule Builder')

type Member = ast.MemberExpression | ast.CallExpression

export const builder = <T extends object>(parent?: (x: Member | ast.Ident) => Member): T => {
  const bolder = (cb: (x: Member | ast.Ident) => Member) => builder((x) => cb(parent ? parent(x) : x))

  return new Proxy((() => {}) as any as T, {
    apply: (_a, _b, c) => bolder((x) => ast.call([x, c.map((x) => ast.literal([`${x}`]))])),
    get: (_t, k) => {
      if (k === BRAND) return BRAND as any
      if (k === OUTPUT) return (arg: any) => (parent ? parent(arg) : arg)

      if (typeof k !== 'string') throw new Error(`Unknown type accessor`)

      if (/^\d{1,}:\d{1,}$/.test(k)) return bolder((x) => ast.member([x, true, k as any]))
      if (/^\d{1,}$/.test(k)) return bolder((x) => ast.member([x, true, k as any]))
      return bolder((x) => ast.member([x, false, k as any]))
    },
  })
}

// const createOps = <T extends Record<string, any>>(x: T) => {}

// const op = createOps({
//   and: ([head, ...tail]) => args.reduce((a, b) => ast.expression([false, a, undefined, '&&', b]), head),
// })

// export const op: Operators = {
//         and: (...args) => join('&&', args),
//     is: (a, type) => rule((gen) => `${gen(a)} is ${type}`),
//     or: (...args) => join('||', args),
//     in: (a: any, b: any) => rule((gen) => `${gen(b)} in ${gen(a)}`),
//     eq: opF('==') as any,
//     neq: opF('!='),
//     gt: opF('>'),
//     lt: opF('<'),
//     gte: opF('>='),
//     lte: opF('<='),
//     add: opF('+'),
//     sub: opF('-'),
//     div: opF('/'),
//     mult: opF('*'),
//     mod: opF('%'),
//   }

export const resultAst = (x: any, input: ast.Ast) => x[OUTPUT](input)
// const b = builder<{ one: string; two: () => { bar: number } }>()

// b.two().bar
