import * as rules from '../firestore/interfaces.js'

type Arg<T = any> = { name: string; type: T }
// const arg = <T extends any, K extends string = string>(name: K) => ({ name, type: {} as T })
export interface Rules<C> {
  arg: <T extends any, K extends string = string>(name: K) => { name: K; type: T }
  function: <K extends string, const A extends Arg[], R extends any>(
    name: K,
    args: A,
    cb: (x: C & { [K in A[number]['name']]: rules.InferRule<Extract<A[number], { name: K }>['type']> }) => R,
  ) => Rules<C & { [_K in K]: (...args: { [K in keyof A]: A[K]['type'] }) => R }>
  //   service: {
  //     (
  //       type: 'cloud.firestore',
  //       cb: (x: ServiceFirestore<C & ContextFirestore<rules.RulesMap<{}>>>) => ServiceFirestore<C>,
  //     ): Rules<C>
  //     // (type: 'cloud.storage', cb: <T>(x: Rules<C>) => Rules<C & T>): Rules<C>
  //   }
}

// const defineRules = (): Rules<{}> => {
//   const scope = ast.rules([[ast.version([ast.literal(['2'])])]])

//   const current: Rules<{}> = {
//     arg: (name) => ({ name, type: undefined as any }),
//     function: (name, args, handler) => {
//       // console.log(output(handler(builder())))
//       scope.statements.push(ast.func([ast.ident([name]), args.map((y) => ast.ident([y.name])), {}]))
//       return current as any
//     },
//   }

//   return current
// }

// const k = defineRules().function('cool', [], (z) => (z as any).request.data)
