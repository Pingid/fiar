import { CloudIcon } from '@heroicons/react/24/outline'
import { Route, Switch } from 'wouter'

import { Extensions, useExtend } from '@fiar/workbench/extensions'
import { type FieldComponent } from '@fiar/content/fields'
import { App } from '@fiar/workbench'

import { FieldAsset } from './components/FieldAsset/index.js'
import { FolderList } from './components/FolderList/index.js'
import { useConfig, AssetConfig } from './hooks/index.js'
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
        <div className="h-full w-full">
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

// const AssetsPage = (props: { children: React.ReactNode }) => {
//   const folders = useConfig((x) => x.folders ?? [])

//   return (
//     <Page>
//       <Page.Breadcrumb title="Assets" icon={<CloudIcon />} href="" />
//       <Page.Head>
//         <div
//           className="flex border-t px-2 text-sm leading-none [&>*:last-child]:border-none"
//           aria-label="Storage folders"
//           role="tablist"
//           aria-orientation="horizontal"
//         >
//           {folders.map((folder) => (
//             <Fragment key={folder.path}>
//               <FolderButton key={folder.path} {...folder} />
//             </Fragment>
//           ))}
//         </div>
//       </Page.Head>
//       {props.children}
//     </Page>
//   )
// }

// const FolderButton = (folder: AssetFolder) => {
//   const path = `/${folder.path.replace(/^\//, '')}`
//   const [match] = useRoute(path)

//   return (
//     <Link
//       href={path}
//       className={cn('border-active/10 flex items-center gap-1.5 px-2 py-2', [match, 'text-active', ''])}
//     >
//       <FolderIcon className="relative -top-[1px] h-4 w-4" />
//       {folder.title}
//     </Link>
//   )
// }
