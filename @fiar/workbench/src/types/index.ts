import { RouteObject } from 'react-router-dom'
import '@fiar/core/types'

declare module '@fiar/core/types' {
  export interface FiarApp {
    pages?: WorkbenchPage[]
    providers?: WorkbenchProvider[]
    user?: AuthUser | undefined
    signout?: (() => Promise<void>) | undefined
    Dashboard?: () => JSX.Element
  }
}

export interface AuthUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string | undefined | null
}

export type WorkbenchPage = RouteObject & { icon?: React.ReactNode; title: string }
export type WorkbenchProvider = (p: { children: React.ReactNode }) => React.ReactNode
