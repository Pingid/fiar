import * as p from 'typescript-parsec'
import * as ast from '../ast/index.js'
import { Tok } from './lexer.js'

/* -------------------------------- Utilities ------------------------------- */
type P<T> = p.Parser<Tok, T>
const arr = <T>(prsr: P<T[] | undefined>) => p.apply(prsr, (x) => x || [])
const str = (x: string): p.Parser<Tok, string> => p.apply(p.str(x), (x) => x.text)
const succ = <T>(x: T): p.Parser<Tok, T> => p.succ(x)
const wrap =
  <A, R>(cb: (args: [A]) => R) =>
  (arg: A) =>
    cb([arg])

const tok = <T extends Tok>(x: T) => p.apply(p.tok(x), (x) => x.text)

const defined = <T>(x: T): x is Exclude<T, null | undefined> => x !== null && typeof x !== 'undefined'

const skipL = p.apply(p.tok(Tok.Line), () => null)

const empty = p.apply(p.seq(p.tok(Tok.Line), p.tok(Tok.Line), p.opt_sc(p.rep(p.tok(Tok.Line)))), () => ast.empty([]))

const padL = <T>(x: P<T>) => p.kmid(p.opt_sc(p.rep_sc(p.tok(Tok.Line))), x, p.opt_sc(p.rep_sc(p.tok(Tok.Line))))

export const value = p.rule<Tok, ast.Value>()

/* ------------------------------ Ident Parser ------------------------------ */
export const ident = p.apply(p.seq(p.tok(Tok.Ident), p.nil()), (x) => ast.ident([x[0].text]))

/* ----------------------------- Literal Parser ----------------------------- */
export const literal = p.apply(p.alt_sc(p.tok(Tok.Bool), p.tok(Tok.Num), p.tok(Tok.Str), p.tok(Tok.Null)), (x) =>
  ast.literal([x.text]),
)

/* ------------------------------ Unary Parser ------------------------------ */
export const unary = p.apply(p.kright(str('!'), value), (x) => ast.unary([x]))

/* ----------------------------- Comment Parser ----------------------------- */
const gap = p.apply(p.rep_sc(p.tok(Tok.Line)), (x) => (x.length > 1 ? '\n\n' : x.length === 1 ? '\n' : ''))
export const comment = p.apply(
  p.seq(tok(Tok.Comment), arr(p.opt_sc(p.rep_sc(p.seq(gap, tok(Tok.Comment)))))),
  ([first, rest]) => ast.comment([rest.flat().reduce<string>((a, b) => a + (b || ''), first)]),
)

/* ------------------------ Structured Value Parsers ------------------------ */
export const array = p.apply(
  p.kmid(str('['), arr(p.opt_sc(p.list_sc(padL(value), str(',')))), p.seq(padL(p.opt_sc(str(','))), str(']'))),
  wrap(ast.array),
)

const property = p.apply(p.seq(literal, p.kright(str(':'), padL(value))), ast.property)
export const object = p.apply(
  p.kmid(str('{'), arr(p.opt_sc(p.list_sc(padL(property), str(',')))), str('}')),
  wrap(ast.object),
)

/* ------------------------- Member and Call Parser ------------------------- */
const members: P<
  ast.MemberExpression | ast.CallExpression | ast.Ident | ast.Literal | ast.ObjectExpression | ast.ArrayExpression
> = p.lrec_sc(
  p.alt_sc(object, array, ident, literal),
  p.alt_sc(
    p.seq(succ('access' as const), p.kright(str('.'), ident)),
    p.seq(succ('computed' as const), p.kmid(str('['), value, str(']'))),
    p.seq(succ('call' as const), p.kmid(str('('), arr(p.opt_sc(p.list_sc(value, str(',')))), str(')'))),
  ),
  (a, [kind, b]) => {
    if (kind === 'access') return ast.member([a, false, b])
    if (kind === 'computed') return ast.member([a, true, b])
    if (a.kind !== 'MemberExpression' && a.kind !== 'Ident') throw ''
    return ast.call([a, b])
  },
)

export const member = p.combine(members, (x) =>
  x.kind === 'MemberExpression' || x.kind === 'CallExpression' ? succ(x) : p.fail(''),
)

/* ------------------------------- Path Parser ------------------------------ */
const apply_seg = (all: (string | ast.Ident)[]) =>
  ast.segment([false, ast.ident([`${all.map((x) => (typeof x === 'string' ? x : x.name)).join('')}`])])

const segment = p.kright(
  str('/'),
  p.alt_sc(
    p.apply(p.seq(str('{'), ident, str('='), str('*'), str('*'), str('}')), apply_seg),
    p.apply(p.seq(str('{'), ident, str('}')), apply_seg),
    p.apply(p.kmid(p.seq(str('$'), str('(')), value, str(')')), (x) => ast.segment([true, x as any])),
    p.apply(p.seq(str('('), ident, str(')')), apply_seg),
    p.apply(p.seq(ident, p.opt_sc(p.kright(str('.'), ident))), ([seg, ext]) => {
      if (ext) return ast.segment([false, { ...seg, name: `${seg.name}.${ext.name}` }])
      return ast.segment([false, seg])
    }),
  ),
)

export const path = p.apply(p.seq(segment, p.rep_sc(segment)), (x) => ast.path([x.flat()]))

/* ----------------------------- Logical Parser ----------------------------- */
const operator = p.apply(p.tok(Tok.Op), (x) => x.text)
const exp_right = p.apply(
  p.seq(p.opt_sc(padL(comment)), padL(operator), p.opt_sc(padL(comment)), padL(value)),
  ([com1, operator, com2, right]) => ({ comment: com1 || com2, operator, right }),
)

export const expression = p.alt_sc(
  p.apply(p.seq(p.alt_sc(member, object, array, unary, path, literal, ident), exp_right), ([left, next]) => {
    if (next.right.kind !== 'Expression' || next.right.param) {
      return ast.node({ kind: 'Expression', left, param: false, ...next })
    }
    return ast.node({
      ...next.right,
      left: ast.expression([false, left, next.comment, next.operator, next.right.left]),
    })
  }),
  p.apply(p.seq(p.kmid(str('('), value, str(')')), p.opt_sc(exp_right)), ([x, next]) => {
    const left = x.kind === 'Expression' ? { ...x, param: true } : x
    if (next) return ast.node({ kind: 'Expression', param: false, left: left, ...next })
    return left
  }),
)

/* ------------------------------ Value Parser ------------------------------ */
value.setPattern(padL(p.alt_sc(unary, expression, member, path, object, array, literal, ident)))

/* ----------------------------- Function Parser ---------------------------- */
const func_let = p.apply(
  p.seq(p.kright(str('let'), ident), p.kleft(p.kright(str('='), value), p.str(';'))),
  ast.func_let,
)
const func_return = p.apply(p.kright(str('return'), p.kleft(p.alt_sc(expression, value), p.opt_sc(str(';')))), (x) =>
  ast.func_return([x]),
)

export const func = p.apply(
  p.seq(
    p.kright(str('function'), ident),
    padL(p.kmid(str('('), arr(p.opt_sc(p.list(ident, str(',')))), str(')'))),
    p.kmid(str('{'), arr(p.opt_sc(p.rep_sc(p.alt_sc(func_let, comment, func_return, empty, skipL)))), str('}')),
  ),
  ([a, b, c]) => ast.func([a, b, c.filter(defined)]),
)

/* ------------------------------ Allow Parser ------------------------------ */
export const allow = p.apply(
  p.seq(
    p.kright(str('allow'), p.kleft(p.list_sc(ident, p.str(',')), p.opt_sc(str(';')))),
    p.opt_sc(p.kright(p.seq(str(':'), str('if')), p.kleft(value, p.opt_sc(str(';'))))),
  ),
  ast.allow,
)

/* ------------------------------ Match Parser ------------------------------ */
export const match = p.rule<Tok, ast.MatchDeclaration>()
match.setPattern(
  p.apply(
    p.seq(
      p.kright(str('match'), path),
      p.kmid(str('{'), arr(p.rep_sc(p.alt_sc(allow, match, func, comment, empty, skipL))), str('}')),
    ),
    ([a, b]) => ast.match([a, b.filter(defined)]),
  ),
)

/* ----------------------------- Service Parser ----------------------------- */
export const service = p.apply(
  p.seq(
    p.kright(
      str('service'),
      p.apply(p.seq(ident, str('.'), ident), ([a, _, b]) => `${a.name}.${b.name}`),
    ),
    p.kmid(str('{'), p.rep_sc(p.alt_sc(func, match, comment, empty, skipL)), str('}')),
  ),
  ([a, b]) => ast.service([a, b.filter(defined)]),
)

/* ------------------------------ Rules Parser ------------------------------ */
export const version = p.apply(
  p.kright(p.str('rules_version'), p.kright(p.str('='), p.kleft(literal, p.opt_sc(str(';'))))),
  (x) => ast.version([x]),
)

export const rules = p.apply(p.rep_sc(p.alt_sc(version, func, service, comment, empty, skipL)), (x) =>
  ast.rules([x.filter(defined)]),
)
