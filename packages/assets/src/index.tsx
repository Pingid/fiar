import { CloudIcon } from '@heroicons/react/24/outline'
import { useLayoutEffect } from 'react'
import { Route, Switch } from 'wouter'

import { Extensions, useExtend } from '@fiar/workbench/extensions'
import { FieldPreview, type FieldForm } from '@fiar/content/fields'
import { App } from '@fiar/workbench'

import { useAssetConfig, AssetConfig } from './context/index.js'
import { FormFieldAsset, PreviewFieldAsset } from './components/Field/index.js'
import { FolderList } from './components/List/index.js'
import { TipTapImageTool } from './components/index.js'
import { Folder } from './components/Folder/index.js'
import { IFieldAsset } from './schema/index.js'

export type { AssetConfig } from './context/index.js'
export { image } from './schema/index.js'

declare module '@fiar/workbench/extensions' {
  export interface Extensions {
    'field:form:asset': FieldForm<IFieldAsset>
    'field:preview:asset': FieldPreview<IFieldAsset>
  }
}

const extensions = { 'field:form:asset': FormFieldAsset, 'field:preview:asset': PreviewFieldAsset } satisfies Extensions

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
