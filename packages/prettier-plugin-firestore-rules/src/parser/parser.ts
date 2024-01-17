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
export const expression = p.rule<Tok, ast.Expression>()
export const literal = p.rule<Tok, ast.Literal>()
export const array = p.rule<Tok, ast.ArrayExpression>()
export const letd = p.rule<Tok, ast.LetDeclaration>()
export const object = p.rule<Tok, ast.ObjectExpression>()
export const property = p.rule<Tok, ast.Property>()
export const member = p.rule<Tok, ast.MemberExpression | ast.Ident | ast.CallExpression>()
export const path = p.rule<Tok, ast.PathDeclaration>()
export const func = p.rule<Tok, ast.FunctionDeclaration>()
export const allow = p.rule<Tok, ast.AllowDeclaration>()

export const match = p.rule<Tok, ast.MatchDeclaration>()
export const service = p.rule<Tok, ast.RulesServiceDeclartion>()
export const rules = p.rule<Tok, ast.RulesDeclartion>()

ident.setPattern(p.apply(p.seq(p.tok(Tok.Ident), p.nil()), (x) => ast.ident([x[0].text])))
value.setPattern(p.alt_sc(expression, member, object, array, literal, ident))

/* ----------------------------- Literal Parser ----------------------------- */
literal.setPattern(
  p.apply(p.alt_sc(p.tok(Tok.Bool), p.tok(Tok.Num), p.tok(Tok.Str), p.tok(Tok.Null)), (x) => ast.literal([x.text])),
)

/* ------------------------ Structured Value Parsers ------------------------ */
array.setPattern(
  p.apply(
    p.kmid(p.tok(Tok.LSquare), arr(p.opt_sc(p.list_sc(value, p.tok(Tok.Coma)))), p.tok(Tok.RSquare)),
    wrap(ast.array),
  ),
)

property.setPattern(p.apply(p.seq(ident, p.kright(p.tok(Tok.Colon), value)), ast.property))

object.setPattern(
  p.apply(
    p.kmid(p.tok(Tok.LCurly), arr(p.opt_sc(p.list_sc(property, p.tok(Tok.Coma)))), p.tok(Tok.RCurly)),
    wrap(ast.object),
  ),
)

/* ------------------------- Member and Call Parser ------------------------- */
const call = p.kmid(p.tok(Tok.LBrack), arr(p.opt_sc(p.list_sc(value, p.tok(Tok.Coma)))), p.tok(Tok.RBrack))
member.setPattern(
  p.lrec_sc(ident, p.alt_sc(p.kright(p.tok(Tok.Dot), ident), call), (a, b) =>
    Array.isArray(b) ? ast.call([a, b]) : ast.member([a, b]),
  ),
)

/* ----------------------------- Logical Parser ----------------------------- */
const logical_side = p.alt_sc(member, literal)
const logical_divide = p.apply(p.tok(Tok.Op), (x) => x.text)
const logical_1: P<ast.Expression> = p.apply(p.seq(logical_side, logical_divide, logical_side), ast.expression)
const logical_chain: P<ast.Expression> = p.lrec_sc(logical_1, p.seq(logical_divide, logical_side), (a, b) =>
  ast.expression([a as any, ...b]),
)

expression.setPattern(
  p.alt_sc(
    p.apply(
      p.seq(
        p.alt_sc(p.kmid(p.tok(Tok.LBrack), logical_chain, p.tok(Tok.RBrack)), logical_chain),
        p.opt_sc(p.seq(logical_divide, p.alt_sc(expression, logical_side))),
      ),
      ([a, b]) => (b ? ast.expression([a, b[0], b[1]]) : a),
    ),
    p.apply(p.seq(ident, logical_divide, p.kmid(p.tok(Tok.LBrack), expression, p.tok(Tok.RBrack))), ast.expression),
    p.apply(
      p.seq(p.kmid(p.tok(Tok.LBrack), expression, p.tok(Tok.RBrack)), p.opt_sc(p.seq(logical_divide, expression))),
      ([a, b]) => (b ? ast.expression([a, b[0], b[1]]) : a),
    ),
  ),
)

/* ------------------------------- Path Parser ------------------------------ */
const path_seq_name = p.apply(p.kright(str('/'), p.tok(Tok.Ident)), (x) => ast.path([`/${x.text}`]))
const path_seq_var = p.apply(p.kright(str('/'), p.kmid(p.tok(Tok.LCurly), p.tok(Tok.Ident), p.tok(Tok.RCurly))), (x) =>
  ast.path([`/{${x.text}}`]),
)
const path_seq = p.alt_sc(path_seq_name, path_seq_var)
path.setPattern(p.lrec_sc(path_seq, path_seq, (a: ast.PathDeclaration, b) => ast.path([`${a.path}${b.path}`])))

/* ----------------------------- Function Parser ---------------------------- */
const func_let = p.apply(p.seq(p.kright(str('let'), ident), p.kleft(p.kright(str('='), value), p.str(';'))), ast.letd)
func.setPattern(
  p.apply(
    p.seq(
      p.kright(str('function'), ident),
      p.kmid(p.tok(Tok.LBrack), arr(p.opt_sc(p.list(ident, p.tok(Tok.Coma)))), p.tok(Tok.RBrack)),
      p.kright(p.tok(Tok.LCurly), arr(p.opt_sc(p.list(func_let, p.tok(Tok.Coma))))),
      p.kleft(p.kright(str('return'), value), p.tok(Tok.RCurly)),
    ),
    ast.func,
  ),
)

/* ------------------------------ Allow Parser ------------------------------ */
allow.setPattern(
  p.apply(
    p.seq(p.kright(str('allow'), ident), p.kright(p.seq(str(':'), str('if')), p.kleft(value, p.opt_sc(str(';'))))),
    ast.allow,
  ),
)

/* ------------------------------ Match Parser ------------------------------ */
match.setPattern(
  p.apply(
    p.seq(
      p.kright(str('match'), path),
      p.kmid(p.tok(Tok.LCurly), arr(p.rep_sc(p.alt_sc(allow, match, func))), p.tok(Tok.RCurly)),
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
      p.kmid(p.tok(Tok.LCurly), p.rep_sc(p.alt_sc(func, match)), p.tok(Tok.RCurly)),
    ),
    ast.service,
  ),
)

/* ------------------------------ Rules Parser ------------------------------ */
rules.setPattern(
  p.apply(
    p.seq(
      p.opt_sc(p.kright(p.str('rules_version'), p.kright(p.str('='), p.kleft(literal, p.opt_sc(str(';')))))),
      p.rep_sc(p.alt_sc(func, service)),
    ),
    ast.rules,
  ),
)
