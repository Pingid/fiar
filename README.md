# Fiar

Fiar is a set of tools for projects working with firebase. It includes a customizable CMS and admin dashboard. A type infered entity schemas. A typescript firestore rules abstraction with auto schema field type validation. The libraries can be used seperately and are designed incrimentally adopted or abondoned as application requirements change.

## Libraries

- [Security rules](packages/rules/README.md)
- [Content CMS](packages/content/README.md)
- [Dashboard Auth](packages/auth/README.md)
- [Assets CMS](packages/assets/README.md)

## Quick Start

This guide goes through setting up a simple blog with a cms and authentication. A complete example of this is found in [simple-blog](examples/simple-blog/README.md).

You should start by setting up firebase if you haven't already. The easiest way to do this is by using the firebase cli. You can install this with npm `npm install -g firebase-tools`. Then run `firebase init` and make sure to include `firestore` and `storage`.

### Define content schema

Create a `models.ts` file.

```ts
import * as s from 'fiar/schema'

export const post = s.model({
  type: 'collection',
  label: 'Blog Posts',
  path: '/posts/{postId}',
  fields: {
    title: s.string(),
    image: s.image({ optional: true }),
    body: s.text(),
    status: s.string({ select: [{ value: 'published' }, { value: 'draft' }] }),
  },
})

export type Post = s.TypeOf<typeof post>
```

### Initialize dashboard

Next we can initialise the admin dashboard. This example is for a static site with no client side routing so it uses a hash routing strategy for the admin dashboard.

```ts
import { initializeApp } from '@firebase/app'
import { createFiar } from 'fiar'
import 'fiar/style.css'

import firebaseConfig from '../firebase.config.json'
import { post } from './models'

createFiar({
  node: document.getElementById('root')!, // Root html node to bind to
  app: initializeApp(firebaseConfig), // Firebase config as found in the firebase console
  storage: { folders: [{ title: 'Photos', path: '/examples/simple-blog/photos' }] }, // Add folder for images
  content: { models: [post] }, // Add models
  router: { type: 'hash' }, // hash | memory | browser
  auth: true, // Configure social providers
})
```

### Security rules

Finally we need to make sure we are alowed to modify the posts collection. Add a `rules.ts` script file which will be used to generate the firestore security rules.

```ts
import { ruleset } from 'fiar/rules'
import fs from 'node:fs'

import { post } from './src/models.js'

const rules = ruleset(({ service }) => {
  service('cloud.firestore', ({ match }) => {
    match('/databases/(default)/documents', () => {
      match(post, ({ allow, and, op }) => {
        allow('read', true)
        allow('write', ({ request }) => and(op(request.auth.token.email, '==', 'admin@example.com')))
      })
    })
  })
})

await fs.promises.writeFile('./firestore.rules', await rules.print())
```

Run the script with `npx tsx ./rules.ts` and ensure that the the generated `firestore.rules` file is referenced in your `firebase.json`. Finally you can run `firebase deploy --only firestore:rules` to update the cloud security rules. You will also need an account firebase auth user account matching the administrator email you used in the security rules. You can add this user in your firebase console with an email and password.

Now you can run your static website and go to the page you defined the admin and login with your admin credentials.
