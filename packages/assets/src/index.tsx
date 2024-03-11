import { CloudIcon } from '@heroicons/react/24/outline'
import React, { useLayoutEffect } from 'react'
import { Route, Switch } from 'wouter'

import { Extensions, useExtend } from '@fiar/workbench/extensions'
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
    'field:form:asset': () => React.ReactNode
    'field:preview:asset': () => React.ReactNode
    'asset:source': { [x: string]: () => React.ReactNode }
  }
}

const extensions = {
  'field:form:asset': FormFieldAsset,
  'field:preview:asset': PreviewFieldAsset,
  'asset:source': {},
} satisfies Extensions

export { FolderAction } from './components/Folder/index.js'

export const Assets = ({ children, ...config }: { children?: React.ReactNode } & AssetConfig) => {
  useLayoutEffect(() => useAssetConfig.setState(config), [config])
  if (!useAssetConfig.getState().firebase) useAssetConfig.setState(config)

  useExtend(extensions)

  return (
    <>
      <TipTapImageTool />
      <App title="Assets" icon={<CloudIcon />} href="/assets">
        <div className="h-full min-h-0 w-full min-w-0">
          <Switch>
            {config.folders?.map((x) => (
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
