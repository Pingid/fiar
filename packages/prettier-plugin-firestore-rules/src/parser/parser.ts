import * as p from 'typescript-parsec'
import { Tok } from './lexer.js'
import * as ast from './ast.js'

/* -------------------------------- Utilities ------------------------------- */
type P<T> = p.Parser<Tok, T>
const arr = <T>(prsr: P<T[] | undefined>) => p.apply(prsr, (x) => x || [])
const str = (x: string): p.Parser<Tok, string> => p.apply(p.str(x), (x) => x.text)
const wrap =
  <A, R>(cb: (args: [A]) => R) =>
  (arg: A) =>
    cb([arg])

/* ---------------------------- Top Level Parsers --------------------------- */
export const ident = p.rule<Tok, ast.Ident>()
export const value = p.rule<Tok, ast.Value>()
export const unary = p.rule<Tok, ast.UnaryExpression>()
export const expression = p.rule<Tok, ast.Expression>()
export const literal = p.rule<Tok, ast.Literal>()
export const comment = p.rule<Tok, ast.Comment>()
export const array = p.rule<Tok, ast.ArrayExpression>()
export const letd = p.rule<Tok, ast.LetDeclaration>()
export const object = p.rule<Tok, ast.ObjectExpression>()
export const property = p.rule<Tok, ast.Property>()
export const member = p.rule<Tok, ast.MemberExpression | ast.Ident | ast.CallExpression>()
export const path = p.rule<Tok, ast.PathDeclaration>()
export const segment = p.rule<Tok, ast.Segment>()
export const func = p.rule<Tok, ast.FunctionDeclaration>()
export const allow = p.rule<Tok, ast.AllowDeclaration>()

export const match = p.rule<Tok, ast.MatchDeclaration>()
export const service = p.rule<Tok, ast.RulesServiceDeclartion>()
export const rules = p.rule<Tok, ast.RulesDeclartion>()

ident.setPattern(p.apply(p.seq(p.tok(Tok.Ident), p.nil()), (x) => ast.ident([x[0].text])))
value.setPattern(p.alt_sc(expression, member, object, array, literal, path, ident, unary))

/* ----------------------------- Literal Parser ----------------------------- */
literal.setPattern(
  p.apply(p.alt_sc(p.tok(Tok.Bool), p.tok(Tok.Num), p.tok(Tok.Str), p.tok(Tok.Null)), (x) => ast.literal([x.text])),
)

/* ------------------------------ Unary Parser ------------------------------ */
unary.setPattern(p.apply(p.kright(str('!'), value), (x) => ast.unary([x])))

/* ----------------------------- Comment Parser ----------------------------- */
comment.setPattern(p.apply(p.tok(Tok.Comment), (x) => ast.comment([x.text])))

/* ------------------------ Structured Value Parsers ------------------------ */
array.setPattern(
  p.apply(
    p.kmid(str('['), arr(p.opt_sc(p.list_sc(value, str(',')))), p.seq(p.opt_sc(str(',')), str(']'))),
    wrap(ast.array),
  ),
)

// const key = p.apply(ident, literal)
property.setPattern(p.apply(p.seq(literal, p.kright(str(':'), value)), ast.property))

object.setPattern(p.apply(p.kmid(str('{'), arr(p.opt_sc(p.list_sc(property, str(',')))), str('}')), wrap(ast.object)))

/* ------------------------- Member and Call Parser ------------------------- */
const call = p.kmid(str('('), arr(p.opt_sc(p.list_sc(value, str(',')))), str(')'))
const member_object = p.alt_sc(ident, literal, object, array)
const member_right = p.alt_sc(p.kright(str('.'), ident), p.kmid(str('['), p.alt_sc(member, literal, ident), str(']')))
const member_first = p.apply(p.seq(member_object, member_right), ast.member)
const call_first = p.apply(p.seq(ident, call), ast.call)

member.setPattern(
  p.alt_sc(
    p.lrec_sc(p.alt_sc(member_first, call_first), p.alt_sc(member_right, call), (a, b) =>
      Array.isArray(b) ? ast.call([a, b]) : ast.member([a, b]),
    ),
    ident,
  ),
)

/* ----------------------------- Logical Parser ----------------------------- */
// const exp_side = p.alt_sc(member, literal, object, array, unary)
const brack = <T>(x: P<T>) => p.kmid(str('('), x, str(')'))
const exp_side = p.alt_sc(
  p.alt_sc(member, literal, object, array, unary, path),
  brack(p.alt_sc(member, literal, object, array, unary, path)),
)

const exp_op = p.apply(p.tok(Tok.Op), (x) => x.text)
export const exp_chain: P<ast.Expression> = p.lrec_sc(
  p.apply(p.seq(p.succ(false), exp_side, exp_op, exp_side), ast.expression),
  p.seq(exp_op, exp_side),
  (a, b) => ast.expression([false, a, ...b]),
)

expression.setPattern(
  p.alt_sc(
    p.apply(
      p.seq(brack(p.alt_sc(exp_chain, expression)), p.opt_sc(p.seq(exp_op, p.alt_sc(expression, exp_chain, exp_side)))),
      ([left, next]) => {
        if (!next) return { ...left, param: true }
        return ast.expression([false, { ...left, param: true }, next[0], next[1]])
      },
    ),
    p.apply(p.seq(exp_chain, p.opt_sc(p.seq(exp_op, expression))), ([left, next]) => {
      if (!next) return left
      return ast.expression([false, left, next[0], next[1]])
    }),
    p.apply(brack(p.seq(p.succ(true), exp_side, exp_op, expression)), ast.expression),
    p.apply(p.seq(p.succ(false), exp_side, exp_op, expression), ast.expression),
    p.apply(p.str('ffasdfasdf'), (x) => x as any),
  ),
)

/* ------------------------------- Path Parser ------------------------------ */
const apply_seg = (all: (string | ast.Ident)[]) => {
  return ast.segment([false, ast.ident([`${all.map((x) => (typeof x === 'string' ? x : x.name)).join('')}`])])
}

segment.setPattern(
  p.kright(
    str('/'),
    p.alt_sc(
      p.apply(p.seq(str('{'), ident, str('='), str('*'), str('*'), str('}')), apply_seg),
      p.apply(p.seq(str('{'), ident, str('}')), apply_seg),
      p.apply(p.kright(str('$'), p.kright(str('('), p.kleft(member, str(')')))), (x) => ast.segment([true, x])),
      p.apply(p.seq(str('('), ident, str(')')), apply_seg),
      p.apply(p.seq(ident, p.opt_sc(p.kright(str('.'), ident))), ([seg, ext]) => {
        if (ext) return ast.segment([false, { ...seg, name: `${seg.name}.${ext.name}` }])
        return ast.segment([false, seg])
      }),
    ),
  ),
)

// const path_seq = p.alt_sc(path_seq_name, path_seq_var_curly, path_seq_var_brack, path_seq_var_curlyy)
path.setPattern(p.apply(p.seq(segment, p.rep_sc(segment)), (x) => ast.path([x.flat()])))

/* ----------------------------- Function Parser ---------------------------- */
const func_let = p.apply(p.seq(p.kright(str('let'), ident), p.kleft(p.kright(str('='), value), p.str(';'))), ast.letd)
func.setPattern(
  p.apply(
    p.seq(
      p.kright(str('function'), ident),
      p.kmid(str('('), arr(p.opt_sc(p.list(ident, str(',')))), str(')')),
      p.kright(str('{'), arr(p.opt_sc(p.rep_sc(p.alt_sc(func_let, comment))))),
      p.kleft(p.kright(str('return'), p.kleft(value, p.opt_sc(str(';')))), str('}')),
    ),
    ast.func,
  ),
)

/* ------------------------------ Allow Parser ------------------------------ */
allow.setPattern(
  p.apply(
    p.seq(
      p.kright(str('allow'), p.kleft(p.list_sc(ident, p.str(',')), p.opt_sc(str(';')))),
      p.opt_sc(p.kright(p.seq(str(':'), str('if')), p.kleft(value, p.opt_sc(str(';'))))),
    ),
    ast.allow,
  ),
)

/* ------------------------------ Match Parser ------------------------------ */
match.setPattern(
  p.apply(
    p.seq(
      p.kright(str('match'), path),
      p.kmid(str('{'), arr(p.rep_sc(p.alt_sc(allow, match, func, comment))), str('}')),
    ),
    ast.match,
  ),
)

/* ----------------------------- Service Parser ----------------------------- */
service.setPattern(
  p.apply(
    p.seq(
      p.kright(
        str('service'),
        p.apply(p.seq(ident, str('.'), ident), ([a, _, b]) => `${a.name}.${b.name}`),
      ),
      p.kmid(str('{'), p.rep_sc(p.alt_sc(func, match, comment)), str('}')),
    ),
    ast.service,
  ),
)

/* ------------------------------ Rules Parser ------------------------------ */
rules.setPattern(
  p.apply(
    p.seq(
      p.opt_sc(p.kright(p.str('rules_version'), p.kright(p.str('='), p.kleft(literal, p.opt_sc(str(';')))))),
      p.rep_sc(p.alt_sc(func, service, comment)),
    ),
    ast.rules,
  ),
)
