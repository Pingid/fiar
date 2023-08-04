# Fiar

Fiar is a highly customizable and type-safe Content Management System (CMS) and admin panel built on top of Firebase and react. As Fiar is currently in alpha, please be aware that the APIs are subject to significant changes.

## Quick Start

It is best to look at the [example](examples/nosense) where you will find the code in implimentation code in `/src/admin`.

### Define Content Schema

Create a content schema by defining a collection or a standalone document. Below is an example schema for a simple blog with a landing page and a collection of articles.

```tsx
import * as f from 'fiar/schema'

// Define a collection
export const articles = f.col({
  ref: 'articles', // Firebase collection ref where the published articles are stored
  label: 'Articles', // Label shown in the UI
  titleField: 'title', // Field used by the article list preview for the title
  fields: {
    title: s.string({ label: 'Title' }),
    body: s.text({ label: 'Content' }),
  },
})
export type Article = typeof articles.infer

// Define a standalone document
export const landing = s.doc({
  ref: 'pages/landing', // Firebase document reference
  label: 'Landing page',
  fields: {
    highlightArticle: s.ref({ label: 'Main article', to: () => articles }),
  },
})

export type LandingPage = typeof landing.infer
```

### Initialize the Dashboard

Fiar operates as a collection of loosely coupled plugins. You must include `fiarWorkbench`, which provides the dashboard. Begin by adding the `fiarContent` CMS plugin.

```tsx
import { fiarWorkbench, fiarContent } from 'fiar/plugins'
import { createFiar } from 'fiar'
import { articles, landing } from './content'
import { firestore } from './firebase'

const fiar = createFiar({
  plugins: [fiarWorkbench({ routing: 'hash' }), fiarContent({ firestore, content: [landing, articles] })],
  components: {},
})

const root = document.getElementById('root')
fiar.render(root)
```

### Authenticate Users

To enable user authentication, add the Firebase authentication client and authentication provider instances.

```tsx
import { EmailAuthProvider } from '@firebase/auth'
import { ...fiarAuth } from 'fiar/plugins'
import { auth } from "./firebase"

const fiar = createFiar({
  plugins: [
    ...
    fiarAuth({ auth, providers: [new EmailAuthProvider()] }),
  ],
  components: {},
})

```

#### Set Roles and Permissions

To restrict access with user roles, you need to set up Firebase functions. Export the following authentication hooks with your email-to-role mapping configuration. These add the `fiar: admin` property to the user `customClaims`. For existing users, you can update the custom claims by setting `{ fiar: 'admin' }` in the Firebase dashboard.

```tsx
import { createAuthHooks } from 'fiar/functions'

export const { fiarBeforeCreate, fiarBeforeSignIn } = createAuthHooks({
  open: false,
  users: [['john@gmail.com', 'admin']],
})
```

#### Update databse rules

All unpublished documents reside in the `_fiar` collection in Firestore unless configured otherwise. In our blog example, we want editors and admins to be able to edit and create draft content. Only admins should have the ability to publish content, and our published content should be publicly available.

```
match /databases/{database}/documents {
  match /_fiar/{document=**} {
    allow read, write: if request.auth.token.fiar in ['editor', 'admin']
  }
   match /landing/{document=**} {
    allow read: if true;
    allow write: if request.auth.token.fiar == 'admin'
  }
  match /articles/{document=**} {
    allow read: if true;
    allow write: if request.auth.token.fiar == 'admin'
  }
}
```

### Add File Storage

Enable the Firebase storage plugin to add images to your blog.

```tsx
import { ...fiarStorage } from 'fiar/plugins'
import { storage } from "./firebase"

const fiar = createFiar({
  plugins: [
    ...
    fiarStorage({ storage }),
  ],
  components: {},
})

```

Use the image field in your schema.

```tsx
import * as f from "fiar/schema"

export const articles = f.col({
  ...
  fields: {
    ...
    banner: s.image({ label: 'Banner image' }),
  }
})

```

Follow these steps to get started with Fiar quickly. Enjoy the power of a customizable and type-safe CMS built on Firebase.
