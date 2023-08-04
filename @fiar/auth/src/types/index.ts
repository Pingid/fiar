import { Functions } from '@firebase/functions'
import { Auth } from '@firebase/auth'
import '@fiar/core/types'

declare module '@fiar/core/types' {
  export interface FiarApp {
    auth?: Auth
    functions?: Functions
  }
}
