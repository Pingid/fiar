# Fiar Security Rules

This library facilitates the creation of Firestore and Firebase storage security rules with TypeScript, offering an expressive method to establish security constraints programmatically. This approach leverages TypeScript's type-checking and IDE support, enhancing maintainability and minimizing errors in security rule definitions. It also supports a modular approach to defining individual match declarations.

## Getting Started

### Installation

```bash
npm install @fiar/rules
# or
yarn add @fiar/rules
```

## Basic Usage

Here's how you might define Firestore rules for a simple blog application:

```ts
import { ruleset } from '@fiar/rules'

const rules = ruleset(({ service }) => {
  service('cloud.firestore', ({ match }) => {
    match('/databases/(default)/documents', ({ match }) => {
      match('/blogs/{blogId}', ({ allow, op }) => {
        allow('read', true) // Publicly readable
        allow('write', ({ request }) => op(request.auth, '!=', null)) // Authenticated writes
      })
    })
  })
})

console.log(await rules.print())
// service cloud.firestore {
//   match /databases/(default)/documents {
//     match /blogs/{blogId} {
//       allow read: if true;
//       allow write: if request.auth != null;
//     }
//   }
// }
```

## Use an entity schema

If you have defined a model schema using `@fiar/schema` you can use this to generate strict field type checking from within firebase security ruleset. You can also use a schema defined by `@fiar/content/schema` which currently a smaller subset of `@fiar/schema`.

```ts
import { s, model } from '@fiar/schema'

const posts = model({
  type: 'collection',
  path: '/posts/{postId}',
  fields: {
    title: s.string({ max: 100 }),
    body: s.string({}),
    tags: s.list({ of: s.string({}) }),
    status: s.union({ of: [s.literal({ value: 'published' }), s.literal({ value: 'draft' })] }),
    updatedAt: s.timestamp({}),
  },
})
```

Replacing the path field in a match declaration provides infered model type into the `request.resource.data` and an extra utility function called

```ts
const ruless = ruleset(({ service }) => {
  service('cloud.firestore', ({ match }) => {
    match('/databases/(default)/documents', ({ match }) => {
      match(posts, ({ allow, op, isValid, and }) => {
        allow('read', ({ request }) => op(request.resource.data.status, '==', 'published'))
        allow('write', ({ request }) => and(op(request.auth, '!=', null), isValid()))
      })
    })
  })
})

// service cloud.firestore {
//   match /databases/(default)/documents {
//     match /posts/{postId} {
//       allow read: if request.resource.data.status == "published";
//       allow write: if (request.auth != null && isValid());
//
//       function isValid() {
//         return (request.resource.data is map
//             && request.resource.data.keys().hasOnly(["title", "body", "tags", "status", "updatedAt"])
//             && (request.resource.data.title is string
//               && request.resource.data.title.size() <= 100)
//             && request.resource.data.body is string
//             && request.resource.data.tags is list
//             && (request.resource.data.status == "published"
//               || request.resource.data.status == "draft")
//             && request.resource.data.updatedAt is timestamp);
//       }
//     }
//   }
// }
```
