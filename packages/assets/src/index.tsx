import { CloudIcon } from '@heroicons/react/24/outline'
import { Route, Switch } from 'wouter'

import { Extensions, useExtend } from '@fiar/workbench/extensions'
import { type FieldComponent } from '@fiar/content/fields'
import { App } from '@fiar/workbench'

import { useConfig, AssetConfig } from './hooks/index.js'
import { FieldAsset } from './components/Field/index.js'
import { FolderList } from './components/List/index.js'
import { TipTapImageTool } from './components/index.js'
import { Folder } from './components/Folder/index.js'
import { IFieldAsset } from './schema/index.js'

export type { AssetConfig } from './hooks/index.js'
export { image } from './schema/index.js'

declare module '@fiar/workbench/extensions' {
  export interface Extensions {
    'field:asset': FieldComponent<IFieldAsset>
  }
}

const extensions = { 'field:asset': FieldAsset } satisfies Extensions

export const Assets = ({ children, ...config }: { children?: React.ReactNode } & AssetConfig) => {
  const state = useConfig.getState()

  useExtend(extensions)

  if (!state.storage && config.storage) {
    useConfig.setState({ ...config, folders: config.folders ?? [] })
  }

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
