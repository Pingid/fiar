import * as s from 'fiar/schema'

export const string = s.defineDocument({
  path: '/fields/string',
  label: 'String',
  fields: {
    string: s.string({ label: 'Basic' }),
    optional: s.string({ label: 'Optional', optional: true }),
    initialValue: s.string({ label: 'Initial', initialValue: 'initial' }),
    multiline: s.string({ label: 'Multiline', multiline: true, placeholder: 'Foo\nBar' }),
    pattern: s.string({ label: 'Pattern', match: '^\\d+$', placeholder: '10' }),
    min: s.string({ label: 'Min', minLength: 5 }),
    max: s.string({ label: 'Max', maxLength: 5 }),
  },
})

export const number = s.defineDocument({
  path: '/fields/number',
  label: 'Number',
  fields: {
    number: s.number({ label: 'Basic' }),
    optional: s.number({ label: 'Optional', optional: true }),
    min: s.number({ label: 'Min', min: 5 }),
    max: s.number({ label: 'Max', max: 5 }),
  },
})

export const boolean = s.defineDocument({
  path: '/fields/boolean',
  label: 'Boolean',
  fields: {
    boolean: s.boolean({ label: 'Basic' }),
    optional: s.boolean({ label: 'Optional', optional: true }),
  },
})

export const timestamp = s.defineDocument({
  path: '/fields/timestamp',
  label: 'Timestamp',
  fields: {
    timestamp: s.timestamp({ label: 'Basic' }),
    optional: s.timestamp({ label: 'Optional', optional: true }),
    on_create: s.timestamp({ computed: 'on-create' }),
    on_update: s.timestamp({ computed: 'on-update' }),
    after: s.timestamp({ label: 'After', after: new Date() }),
    before: s.timestamp({ label: 'Before', before: new Date() }),
  },
})

const fields = s.defineCollection({
  path: '/fields',
  label: 'Fields collection',
  fields: {
    string: s.string({ label: 'String' }),
    number: s.number({ label: 'Number' }),
    boolean: s.boolean({ label: 'Boolean' }),
    text: s.text({ label: 'Text' }),
    map: s.map({ label: 'Map', fields: { string: s.string({ label: 'Nested String' }) } }),
    list_string: s.list({ label: 'List string', of: s.string() }),
    list_map: s.list({
      label: 'List map',
      of: s.map({
        fields: { string: s.string({ label: 'List map string' }), number: s.number({ label: 'List map number' }) },
      }),
    }),
  },
})

export const models = [string, number, boolean, timestamp, fields]
