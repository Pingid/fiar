import { expect, test, describe } from 'vitest'
import * as p from 'typescript-parsec'
import prettier from 'prettier'

import { Tok, lexer } from './lexer.js'
import * as parse from './parser.js'
import * as ast from './ast.js'

// UTILITIES
const expast = (x: p.Parser<Tok, any>, text: string) =>
  expect(p.expectEOF(p.expectSingleResult(x.parse(lexer.parse(text)))))

const test_parser = <T extends any>(parser: p.Parser<Tok, T>, text: string, x: T) =>
  test(`parse ${text.replace(/\n/g, '\\n')}`, () => expast(parser, text).toEqual(x))

/* ------------------------------ Test Literal ------------------------------ */
describe('literal', () => {
  test_parser(parse.literal, '10', ast.literal(['10']))
  test_parser(parse.literal, '"10"', ast.literal(['"10"']))
  test_parser(parse.literal, 'true', ast.literal(['true']))
  test_parser(parse.literal, 'false', ast.literal(['false']))
})

/* ----------------------------- Test Structured ---------------------------- */
describe('structured', () => {
  test_parser(parse.array, '[]', ast.array([[]]))
  test_parser(
    parse.array,
    '[10, "foo", false]',
    ast.array([[ast.literal(['10']), ast.literal(['"foo"']), ast.literal(['false'])]]),
  )
  test_parser(
    parse.array,
    '[10, ["foo", false]]',
    ast.array([[ast.literal(['10']), ast.array([[ast.literal(['"foo"']), ast.literal(['false'])]])]]),
  )

  test_parser(parse.object, `{ 'foo': 2 }`, ast.object([[ast.property([ast.literal([`'foo'`]), ast.literal(['2'])])]]))
  test_parser(
    parse.object,
    `{ 'foo': { "bar": "2" } }`,
    ast.object([
      [
        ast.property([
          ast.literal([`'foo'`]),
          ast.object([[ast.property([ast.literal([`"bar"`]), ast.literal(['"2"'])])]]),
        ]),
      ],
    ]),
  )

  test_parser(
    parse.object,
    `{ 'foo': [{ 'bar': "2" }] }`,
    ast.object([
      [
        ast.property([
          ast.literal([`'foo'`]),
          ast.array([[ast.object([[ast.property([ast.literal([`'bar'`]), ast.literal(['"2"'])])]])]]),
        ]),
      ],
    ]),
  )
})

/* ------------------------------- Test Member ------------------------------ */
describe('member', () => {
  test_parser(parse.member, 'one.two', ast.member([ast.ident(['one']), ast.ident(['two'])]))
  test_parser(parse.member, 'one(10)', ast.call([ast.ident(['one']), [ast.literal(['10'])]]))
  test_parser(
    parse.member,
    'one(10, "hello", data)',
    ast.call([ast.ident(['one']), [ast.literal(['10']), ast.literal(['"hello"']), ast.ident(['data'])]]),
  )
  test_parser(
    parse.member,
    'one(10).two',
    ast.member([ast.call([ast.ident(['one']), [ast.literal(['10'])]]), ast.ident(['two'])]),
  )
  test_parser(parse.member, 'one.two()', ast.call([ast.member([ast.ident(['one']), ast.ident(['two'])]), []]))
  test_parser(parse.member, 'one["two"]', ast.member([ast.ident(['one']), ast.literal(['"two"'])]))
  test_parser(parse.member, 'one[two]', ast.member([ast.ident(['one']), ast.ident(['two'])]))
  test_parser(
    parse.member,
    'one[one.two]',
    ast.member([ast.ident(['one']), ast.member([ast.ident(['one']), ast.ident(['two'])])]),
  )
})

/* ------------------------------- Test unary ------------------------------- */
describe('unary', async () => {
  test_parser(parse.unary, '!10', ast.unary([ast.literal(['10'])]))
})

/* ------------------------------ Test Comment ------------------------------ */
describe('comment', async () => {
  test_parser(parse.comment, '// foo', ast.comment(['// foo']))
  test_parser(parse.comment, '/* foo */', ast.comment(['/* foo */']))
  test_parser(parse.comment, `/*\n * foo\n * foo */`, ast.comment([`/*\n * foo\n * foo */`]))
  test_parser(parse.comment, `/*\n foo\n foo */`, ast.comment([`/*\n foo\n foo */`]))
})

/* ----------------------------- Test Expression ---------------------------- */
describe('expression', () => {
  test_parser(parse.expression, `a && b`, ast.expression([false, ast.ident(['a']), '&&', ast.ident(['b'])]))
  test_parser(
    parse.expression,
    `a && b && c`,
    ast.expression([false, ast.expression([false, ast.ident(['a']), '&&', ast.ident(['b'])]), '&&', ast.ident(['c'])]),
  )

  test_parser(parse.expression, `a && (b)`, ast.expression([false, ast.ident(['a']), '&&', ast.ident(['b'])]))

  test_parser(
    parse.expression,
    `(a && b && c)`,
    ast.expression([true, ast.expression([false, ast.ident(['a']), '&&', ast.ident(['b'])]), '&&', ast.ident(['c'])]),
  )

  test_parser(
    parse.expression,
    `a && (b && c)`,
    ast.expression([false, ast.ident(['a']), '&&', ast.expression([true, ast.ident(['b']), '&&', ast.ident(['c'])])]),
  )
  test_parser(
    parse.expression,
    `(a && (b && c))`,
    ast.expression([true, ast.ident(['a']), '&&', ast.expression([true, ast.ident(['b']), '&&', ast.ident(['c'])])]),
  )
  test_parser(
    parse.expression,
    `(a && b) && c`,
    ast.expression([false, ast.expression([true, ast.ident(['a']), '&&', ast.ident(['b'])]), '&&', ast.ident(['c'])]),
  )
  test_parser(
    parse.expression,
    `(a && b) || (c && d)`,
    ast.expression([
      false,
      ast.expression([true, ast.ident(['a']), '&&', ast.ident(['b'])]),
      '||',
      ast.expression([true, ast.ident(['c']), '&&', ast.ident(['d'])]),
    ]),
  )
  test_parser(
    parse.expression,
    `a && (b && (c && d))`,
    ast.expression([
      false,
      ast.ident(['a']),
      '&&',
      ast.expression([true, ast.ident(['b']), '&&', ast.expression([true, ast.ident(['c']), '&&', ast.ident(['d'])])]),
    ]),
  )
  test_parser(
    parse.expression,
    `a && (b && (c && d)) && e`,
    ast.expression([
      false,
      ast.expression([
        false,
        ast.ident(['a']),
        '&&',
        ast.expression([
          true,
          ast.ident(['b']),
          '&&',
          ast.expression([true, ast.ident(['c']), '&&', ast.ident(['d'])]),
        ]),
      ]),
      '&&',
      ast.ident(['e']),
    ]),
  )
  // Symbols
  test_parser(parse.expression, `data is map`, ast.expression([false, ast.ident(['data']), 'is', ast.ident(['map'])]))
})

/* ------------------------------- Test Paths ------------------------------- */
const seg = (str: string) => ast.segment([false, ast.ident([str])])

describe('paths', () => {
  test_parser(parse.path, '/one', ast.path([[seg('one')]]))
  test_parser(parse.path, '/{one}', ast.path([[seg('{one}')]]))
  test_parser(parse.path, '/(one)', ast.path([[seg('(one)')]]))
  test_parser(parse.path, '/{one=**}', ast.path([[seg('{one=**}')]]))
  test_parser(parse.path, '/{one}/two', ast.path([[seg('{one}'), seg('two')]]))
  test_parser(parse.path, '/one/{two}/three', ast.path([[seg('one'), seg('{two}'), seg('three')]]))
  test_parser(
    parse.path,
    '/one/{two}/three/{four=**}',
    ast.path([[seg('one'), seg('{two}'), seg('three'), seg('{four=**}')]]),
  )
})

/* ----------------------------- Test Functions ----------------------------- */
describe('functions', () => {
  test_parser(
    parse.func,
    'function one(){ return 10 }',
    ast.func([ast.ident(['one']), [], [ast.func_return([ast.literal(['10'])])]]),
  )
  test_parser(
    parse.func,
    'function one(data){ let m = [10]; return m == data }',
    ast.func([
      ast.ident(['one']),
      [ast.ident(['data'])],
      [
        ast.func_let([ast.ident(['m']), ast.array([[ast.literal(['10'])]])]),
        ast.func_return([ast.expression([false, ast.ident(['m']), '==', ast.ident(['data'])])]),
      ],
    ]),
  )
})
/* ------------------------------- Test Allow ------------------------------- */
describe('allow', () => {
  // allow read, write;
  test_parser(parse.allow, 'allow read', ast.allow([[ast.ident(['read'])], undefined]))
  test_parser(parse.allow, 'allow read;', ast.allow([[ast.ident(['read'])], undefined]))
  test_parser(parse.allow, 'allow read, write;', ast.allow([[ast.ident(['read']), ast.ident(['write'])], undefined]))
  test_parser(parse.allow, 'allow update: if true', ast.allow([[ast.ident(['update'])], ast.literal(['true'])]))
  test_parser(
    parse.allow,
    'allow delete, update: if true',
    ast.allow([[ast.ident(['delete']), ast.ident(['update'])], ast.literal(['true'])]),
  )
})

/* ------------------------------- Test Match ------------------------------- */
describe('match', () => {
  const path = ast.path([[seg('something'), seg('{id}')]])
  test_parser(parse.match, 'match /something/{id} {}', ast.match([path, []]))
  test_parser(
    parse.match,
    'match /something/{id} { allow update: if true; }',
    ast.match([path, [ast.allow([[ast.ident(['update'])], ast.literal(['true'])])]]),
  )
  test_parser(
    parse.match,
    'match /something/{id} { function one() { return true } }',
    ast.match([path, [ast.func([ast.ident(['one']), [], [ast.func_return([ast.literal(['true'])])]])]]),
  )
})
/* ------------------------------ Test Service ------------------------------ */
describe('service', () => {
  test_parser(parse.service, `service cloud.firestore { }`, ast.service(['cloud.firestore', []]))
  test_parser(
    parse.service,
    `service cloud.firestore { match /something/{id} {} }`,
    ast.service(['cloud.firestore', [ast.match([ast.path([[seg('something'), seg('{id}')]]), []])]]),
  )
})

/* ------------------------------- Test Rules ------------------------------- */
test('rules', () => {
  const example = `
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /something/{id} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
  `
  const result = p.expectSingleResult(p.expectEOF(parse.rules.parse(lexer.parse(example))))

  const example_ast = ast.rules([
    ast.literal(["'2'"]),
    [
      ast.service([
        'cloud.firestore',
        [
          ast.match([
            ast.path([[seg('databases'), seg('{database}'), seg('documents')]]),
            [
              ast.match([
                ast.path([[seg('something'), seg('{id}')]]),
                [
                  ast.allow([[ast.ident(['read'])], ast.literal(['true'])]),
                  ast.allow([
                    [ast.ident(['write'])],
                    ast.expression([
                      false,
                      ast.member([ast.ident(['request']), ast.ident(['auth'])]),
                      '!=',
                      ast.literal(['null']),
                    ]),
                  ]),
                ],
              ]),
            ],
          ]),
        ],
      ]),
    ],
  ])

  expect(result).toEqual(example_ast)
})

export const debug = (parser: p.Parser<any, any>, text: string) =>
  test('', async () => console.log(await debug_print(parser.parse(lexer.parse(text)))))

const debug_print = (o: p.ParserOutput<any, any>) => {
  let out: any = {}
  if (o.successful) out.result = o.candidates.map((x) => x.result)
  if (o.error) out.error = o.error
  return prettier.format(JSON.stringify(out), { semi: false, parser: 'json' })
}
