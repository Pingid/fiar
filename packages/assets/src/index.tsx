import { CloudIcon } from '@heroicons/react/24/outline'
import React, { useLayoutEffect } from 'react'

import { Extensions, useExtend } from '@fiar/workbench/extensions'
import { Route, Switch } from '@fiar/workbench/router'
import { App } from '@fiar/workbench'

import { FormFieldAsset, PreviewFieldAsset } from './components/Field/index.js'
import { useAssetConfig, AssetConfig } from './context/index.js'
import { FolderList } from './components/List/index.js'
import { TipTapImageTool } from './components/index.js'
import { Folder } from './components/Folder/index.js'

export * from './context/index.js'
export { image } from './schema/index.js'

declare module '@fiar/workbench/extensions' {
  export interface Extensions {
    'field/asset/form': () => React.ReactNode
    'field/asset/preview': () => React.ReactNode
  }
}

const extensions = {
  'field/asset/form': FormFieldAsset,
  'field/asset/preview': PreviewFieldAsset,
} satisfies Extensions

export { FolderAction } from './components/Folder/index.js'

export const Assets = ({ children, ...config }: { children?: React.ReactNode } & AssetConfig) => {
  useLayoutEffect(() => useAssetConfig.setState(config), [config])
  if (!useAssetConfig.getState().app) useAssetConfig.setState(config)

  useExtend(extensions)

  return (
    <>
      <TipTapImageTool />
      <App title="Assets" icon={<CloudIcon />} href="/assets">
        <div className="h-full min-h-0 w-full min-w-0">
          <Switch>
            {config.assets?.map((x) => (
              <Route key={x.path} path={`/${x.path.replace(/^\//, '')}`}>
                <Folder {...x} />
              </Route>
            ))}
            <Route path="">
              <FolderList />
            </Route>
          </Switch>
        </div>
      </App>
    </>
  )
}
