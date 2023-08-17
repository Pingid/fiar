import '@fiar/core/types'

declare module '@fiar/core/types' {
  export interface FiarComponents {
    [provider: `workbench:provider:${string}`]: WorkbenchProvider
    [page: `workbench:page:${string}`]: WorkbenchPage
    auth?: { user?: AuthUser | undefined; signout?: (() => Promise<void>) | undefined } | null
  }
}

export interface AuthUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string | undefined | null
}

export type WorkbenchPage = { element: JSX.Element; path: string; icon?: JSX.Element; title?: string }
export type WorkbenchProvider = (p: { children: JSX.Element }) => JSX.Element
