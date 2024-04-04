import { CloudIcon } from '@heroicons/react/24/outline'
import React, { useLayoutEffect } from 'react'

import { Route, Switch } from '@fiar/workbench/router'
import { App } from '@fiar/workbench'

import { useAssetConfig, AssetConfig } from './context/index.js'
import { FolderList } from './components/List/index.js'
import { TipTapImageTool } from './components/index.js'
import { Folder } from './components/Folder/index.js'
import './components/Field/index.js'

export { FolderAction } from './components/Folder/index.js'
export { image } from './schema/index.js'
export * from './context/index.js'

export const Storage = ({ children, ...config }: { children?: React.ReactNode } & AssetConfig) => {
  useLayoutEffect(() => useAssetConfig.setState(config), [config])
  if (!useAssetConfig.getState().app) useAssetConfig.setState(config)

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
