import { CloudIcon } from '@heroicons/react/24/outline'
import { Route, Switch, useLocation } from 'wouter'
import { useEffect } from 'react'

import { Extensions, useExtend } from '@fiar/workbench/extensions'
import { type FieldComponent } from '@fiar/content/fields'
import { getSlots, setSlot } from '@fiar/components'
import { App, Page } from '@fiar/workbench'

import { useConfig, AssetConfig, AssetFolder } from './hooks/index.js'
import { FieldAsset } from './components/FieldAsset/index.js'
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
  const slot = getSlots(children, { folders: [Assets.Folder] })
  const state = useConfig.getState()
  const first = [...(config.folders ?? []), ...slot.folders.map((x) => x.props)][0]

  useExtend(extensions)

  if (!state.storage && config.storage) {
    useConfig.setState({ ...config, folders: [...(config.folders ?? []), ...slot.folders.map((x) => x.props)] })
  }

  return (
    <>
      <TipTapImageTool />
      <App title="Assets" icon={<CloudIcon />} href="/assets">
        <div className="h-full w-full">
          <Page>
            <Switch>
              {(config.folders ?? []).map((x) => (
                <Route key={x.path} path={`/${x.path.replace(/^\//, '')}`}>
                  <Folder {...x} />
                </Route>
              ))}
              {slot.folders.map((x) => (
                <Route key={x.props.path} path={`/${x.props.path.replace(/^\//, '')}`}>
                  {x}
                </Route>
              ))}
              {first && (
                <Route path="">
                  <Redirect to={`/${first.path.replace(/^\//, '')}`} />
                </Route>
              )}
            </Switch>
          </Page>
        </div>
      </App>
    </>
  )
}

const Redirect = (props: { to: string }) => {
  const [_loc, set] = useLocation()
  useEffect(() => set(props.to, { replace: true }), [props.to])
  return null
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

Assets.Folder = setSlot('Assets.Folder', (props: AssetFolder) => <Folder {...props} />)
