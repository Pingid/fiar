import * as s from 'fiar/schema'

export const string = s.defineDocument({
  path: '/fields/string',
  label: 'String',
  group: 'Primitives',
  fields: {
    string: s.string({ label: 'Basic' }),
    optional: s.string({ label: 'Optional', optional: true }),
    initialValue: s.string({ label: 'Initial', initialValue: 'initial' }),
    multiline: s.string({ label: 'Multiline', multiline: true, placeholder: 'Foo\nBar' }),
    select: s.string({ label: 'Select', select: ['Foo', 'Bar', 'baz'], initialValue: 'Bar' }),
    pattern: s.string({ label: 'Pattern', match: '^\\d+$', placeholder: '10' }),
    min: s.string({ label: 'Min', minLength: 5 }),
    max: s.string({ label: 'Max', maxLength: 5 }),
    text: s.text({ label: 'wysiwyg' }),
  },
})

export const number = s.defineDocument({
  path: '/fields/number',
  label: 'Number',
  group: 'Primitives',
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
  group: 'Primitives',
  fields: {
    boolean: s.boolean({ label: 'Basic', description: 'Boolean field is always false by default' }),
    optional: s.boolean({ label: 'Optional', optional: true }),
  },
})

export const timestamp = s.defineDocument({
  path: '/fields/timestamp',
  label: 'Timestamp',
  group: 'Primitives',
  fields: {
    timestamp: s.timestamp({ label: 'Basic' }),
    optional: s.timestamp({ label: 'Optional', optional: true }),
    on_create: s.timestamp({ auto: 'create' }),
    on_update: s.timestamp({ auto: 'update' }),
    after: s.timestamp({ label: 'After', after: new Date() }),
    before: s.timestamp({ label: 'Before', before: new Date() }),
  },
})

export const map = s.defineDocument({
  path: '/fields/map',
  label: 'Map',
  group: 'Structured',
  fields: {
    map: s.map({
      label: 'Basic',
      description:
        'Map fields can be nested by default they will see any extra fields that arent defined as errors and prompt you to remove them. To allow for etra fields you can add the loose: true flag',
      fields: { string: s.string({ label: 'Field 1' }), number: s.number({ label: 'Field 2' }) },
    }),
  },
})

export const assets = s.defineDocument({
  path: '/fields/assets',
  label: 'Assets',
  group: 'Structured',
  fields: {
    asset: s.asset({ label: 'Asset' }),
    // map: s.map({
    //   label: 'Basic',
    //   description:
    //     'Map fields can be nested by default they will see any extra fields that arent defined as errors and prompt you to remove them. To allow for etra fields you can add the loose: true flag',
    //   fields: { string: s.string({ label: 'Field 1' }), number: s.number({ label: 'Field 2' }) },
    // }),
  },
})

export const all = s.defineDocument({
  path: '/fields/complete',
  label: 'All Fields',
  fields: {
    ...string.fields,
    ...number.fields,
    ...boolean.fields,
    ...timestamp.fields,
    ...map.fields,
  },
})

const fields = s.defineCollection({
  path: '/demo/{id}',
  label: 'Fields collection',
  group: 'Collections',
  fields: {
    string: s.string({ label: 'String', description: 'The string field type is can come in a variety of styles' }),
    number: s.number({ label: 'Number', description: 'The string field type is can come in a variety of styles' }),
    boolean: s.boolean({ label: 'Boolean', description: 'The string field type is can come in a variety of styles' }),
    text: s.text({ label: 'Text', description: 'The string field type is can come in a variety of styles' }),
    map: s.map({
      label: 'Map',
      description: 'The string field type is can come in a variety of styles',
      fields: { string: s.string({ label: 'Nested String' }) },
    }),
    list_string: s.list({
      description: 'The string field type is can come in a variety of styles',
      label: 'List string',
      of: s.string(),
    }),
    list_map: s.list({
      label: 'List map',
      description: 'The string field type is can come in a variety of styles',
      of: s.map({
        description: 'The string field type is can come in a variety of styles',
        fields: { string: s.string({ label: 'List map string' }), number: s.number({ label: 'List map number' }) },
      }),
    }),
  },
})

export const models = [string, number, boolean, timestamp, map, all, fields, assets]
