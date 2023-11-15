import '@fiar/core/types'

import { AuthAuthorise } from './auth-authorize/index.js'
import { AuthLogin } from './auth-login/index.js'

declare module '@fiar/core/types' {
  export interface FiarComponents {
    [AuthAuthorise.label]?: typeof AuthAuthorise.Component
    [AuthLogin.label]?: typeof AuthLogin.Component
  }
}
