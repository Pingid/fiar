# Fiar Security Rules

Part of the [fiar](https://github.com/Pingid/fiar) ecosystem.

This library facilitates the creation of Firestore and Firebase storage security rules with TypeScript, offering an expressive method to establish security constraints programmatically. This approach leverages TypeScript's type-checking and IDE support, enhancing maintainability and minimizing errors in security rule definitions. It also supports a modular approach to defining individual match declarations.

## Getting Started

### Installation

```bash
npm install @fiar/rules
# or
yarn add @fiar/rules
```

## Basic Usage

Below is an example of how to define Firestore rules for a simple blog application:

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

If you've defined a model schema using `@fiar/schema`, you can leverage it to enforce strict field type checking within your Firebase security ruleset. The `@fiar/content/schema` can also be used but offers a smaller subset of functionalities compared to `@fiar/schema`.

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

Providing the model as the first argument in a match declaration injects the inferred model type into the `request.resource.data` and introduces an additional utility function called `isValid`:

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
