import { expect, test } from 'vitest'
import prettier from 'prettier'

import plugin from '../prettier/index.js'

const format = (str: string) => prettier.format(str, { filepath: 'test.rules', plugins: [plugin] })
const match = (name: string, str: string) =>
  test(name, async () => {
    const result = await format(str.trim())
    if (result !== str.trim()) console.log(result)
    expect(result).toBe(str.trim())
  })

match(
  'empty spaces in rules and match statements',
  `
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /foo {

    }
  }
}`,
)

match(
  'function',
  `
function getSomething(data) {
  return data.get('something');
}`,
)

match(
  'function',
  `
function hasValue(value, uid, carId) {
  // a comment
  let someValue = true || request.resource.data.size() == 2;
  return get(/databases/$(database)/documents/someData/$(uid)/subCollection/$(carId)).data.someData.hasAll([value]);
}`,
)

match(
  'comments',
  `
// Foo
// Bar

// Baz
function foobar() {
  return foo
    // Foo
    && bar;
}`,
)
