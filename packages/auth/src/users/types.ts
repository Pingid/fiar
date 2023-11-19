import '@fiar/content/schema'

export type AuthRoles = 'any' | 'auth' | `role:${string}` | `${string}@${string}`

declare module '@fiar/content/schema' {
  export interface IContentDef {
    auth?: {
      read?: AuthRoles | AuthRoles[]
      write?: AuthRoles | AuthRoles[]
      create?: AuthRoles | AuthRoles[]
      update?: AuthRoles | AuthRoles[]
      delete?: AuthRoles | AuthRoles[]
    }
  }
}
