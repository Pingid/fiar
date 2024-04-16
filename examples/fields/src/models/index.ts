import * as s from 'fiar/schema'

export const string = s.defineDocument({
  path: '/fields/string',
  label: 'String',
  fields: {
    string: s.string({ label: 'Basic' }),
    optional: s.string({ label: 'Optional', optional: true }),
    initialValue: s.string({ label: 'Initial value', initialValue: 'initial' }),
    multiline: s.string({ label: 'Multiline', multiline: true }),
    // match: s.string({ label: 'Match', match: '^d+(?:.d+)?$' }),
  },
})

export const models = [string]
