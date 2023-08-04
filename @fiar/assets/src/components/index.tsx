import '@fiar/core/types'

import { Asset } from './assets-browser/Asset'
import { ContentFieldAssetsImage } from './content-field-assets-image'

declare module '@fiar/core/types' {
  export interface FiarComponents {
    [Asset.label]?: typeof Asset.Component
    [ContentFieldAssetsImage.label]?: typeof ContentFieldAssetsImage.Component
  }
}

export const components = {
  [ContentFieldAssetsImage.label]: ContentFieldAssetsImage.Component,
}
