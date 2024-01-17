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
  test(`parse ${text}`, () => expast(parser, text).toEqual(x))

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

  test_parser(parse.object, '{ foo: 2 }', ast.object([[ast.property([ast.ident(['foo']), ast.literal(['2'])])]]))
  test_parser(
    parse.object,
    '{ foo: { bar: "2" } }',
    ast.object([
      [ast.property([ast.ident(['foo']), ast.object([[ast.property([ast.ident(['bar']), ast.literal(['"2"'])])]])])],
    ]),
  )

  test_parser(
    parse.object,
    '{ foo: [{ bar: "2" }] }',
    ast.object([
      [
        ast.property([
          ast.ident(['foo']),
          ast.array([[ast.object([[ast.property([ast.ident(['bar']), ast.literal(['"2"'])])]])]]),
        ]),
      ],
    ]),
  )
})

/* ------------------------------- Test Member ------------------------------ */
describe('member', () => {
  test_parser(parse.member, 'one', ast.ident(['one']))
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
})

/* ----------------------------- Test Expression ---------------------------- */
describe('expression', () => {
  test('', async () => {
    console.log(await debug(parse.expression.parse(lexer.parse(`a && b && c || (c && d)`))))
  })

  test_parser(parse.expression, `a && b`, ast.expression([false, ast.ident(['a']), '&&', ast.ident(['b'])]))
  test_parser(
    parse.expression,
    `a && b && c`,
    ast.expression([false, ast.expression([false, ast.ident(['a']), '&&', ast.ident(['b'])]), '&&', ast.ident(['c'])]),
  )
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
  // test_parser(
  //   parse.expression,
  //   `a && b && c || (c && d)`,
  //   ast.expression([
  //     false,
  //     ast.expression()
  //     ast.expression([true, ast.ident(['a']), '&&', ast.ident(['b'])]),
  //     '||',
  //     ast.expression([true, ast.ident(['c']), '&&', ast.ident(['d'])]),
  //   ]),
  // )
  // Symbols
  test_parser(parse.expression, `data is map`, ast.expression([false, ast.ident(['data']), 'is', ast.ident(['map'])]))
})

/* ------------------------------- Test Paths ------------------------------- */
describe('paths', () => {
  test_parser(parse.path, '/one', ast.path(['/one']))
  test_parser(parse.path, '/{one}', ast.path(['/{one}']))
  test_parser(parse.path, '/{one}/two', ast.path(['/{one}/two']))
  test_parser(parse.path, '/one/two', ast.path(['/one/two']))
  test_parser(parse.path, '/one/{two}/four', ast.path(['/one/{two}/four']))
})

/* ----------------------------- Test Functions ----------------------------- */
describe('functions', () => {
  test_parser(parse.func, 'function one(){ return 10 }', ast.func([ast.ident(['one']), [], [], ast.literal(['10'])]))
  test_parser(
    parse.func,
    'function one(data){ let m = [10]; return m == data }',
    ast.func([
      ast.ident(['one']),
      [ast.ident(['data'])],
      [ast.letd([ast.ident(['m']), ast.array([[ast.literal(['10'])]])])],
      ast.expression([false, ast.ident(['m']), '==', ast.ident(['data'])]),
    ]),
  )
})
/* ------------------------------- Test Allow ------------------------------- */
describe('allow', () => {
  test_parser(parse.allow, 'allow update: if true', ast.allow([ast.ident(['update']), ast.literal(['true'])]))
})

/* ------------------------------- Test Match ------------------------------- */
describe('match', () => {
  test_parser(parse.match, 'match /something/{id} {}', ast.match([ast.path(['/something/{id}']), []]))
  test_parser(
    parse.match,
    'match /something/{id} { allow update: if true; }',
    ast.match([ast.path(['/something/{id}']), [ast.allow([ast.ident(['update']), ast.literal(['true'])])]]),
  )
  test_parser(
    parse.match,
    'match /something/{id} { function one() { return true } }',
    ast.match([ast.path(['/something/{id}']), [ast.func([ast.ident(['one']), [], [], ast.literal(['true'])])]]),
  )
})
/* ------------------------------ Test Service ------------------------------ */
describe('service', () => {
  test_parser(parse.service, `service cloud.firestore { }`, ast.service(['cloud.firestore', []]))
  test_parser(
    parse.service,
    `service cloud.firestore { match /something/{id} {} }`,
    ast.service(['cloud.firestore', [ast.match([ast.path(['/something/{id}']), []])]]),
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
            ast.path(['/databases/{database}/documents']),
            [
              ast.match([
                ast.path(['/something/{id}']),
                [
                  ast.allow([ast.ident(['read']), ast.literal(['true'])]),
                  ast.allow([
                    ast.ident(['write']),
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

const debug = (o: p.ParserOutput<any, any>) => {
  let out: any = {}
  if (o.successful) out.result = o.candidates.map((x) => x.result)
  if (o.error) out.error = o.error
  return prettier.format(JSON.stringify(out), { semi: false, parser: 'json' })
}
