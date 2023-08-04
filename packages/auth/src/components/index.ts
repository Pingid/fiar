import '@fiar/core/types'

import { AuthAuthorise } from './auth-authorize'
import { AuthLogin } from './auth-login'

declare module '@fiar/core/types' {
  export interface FiarComponents {
    [AuthAuthorise.label]?: typeof AuthAuthorise.Component
    [AuthLogin.label]?: typeof AuthLogin.Component
  }
}
