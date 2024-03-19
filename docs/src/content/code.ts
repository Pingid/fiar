import * as s from 'fiar/schema'

const user = s.defineCollection({
  path: '/user/{userId}',
  label: 'Users',
  columns: ['firstName', 'email'],
  fields: {
    firstName: s.string(),
    lastName: s.string({ optional: true }),
    email: s.string(),
  },
})

export type User = s.TypeOf<typeof user>
