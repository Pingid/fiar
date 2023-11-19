import { CloudIcon, FolderIcon } from '@heroicons/react/24/outline'
import { Link, Route, Switch, useLocation, useRoute } from 'wouter'
import { useEffect } from 'react'
import { cn } from 'mcn'

import { getSlots, setSlot } from '@fiar/components'
import { App, Page } from '@fiar/workbench'

import { useConfig, AssetConfig, AssetFolder } from './context/index.js'
import { Folder } from './folder/index.js'

import './components/index.js'

export type { AssetConfig } from './context/index.js'
export { image } from './schema/index.js'

export const Assets = ({ children, ...config }: { children?: React.ReactNode } & AssetConfig) => {
  const slot = getSlots(children, { folders: [Assets.Folder] })
  const state = useConfig.getState()
  const first = [...(config.folders ?? []), ...slot.folders.map((x) => x.props)][0]

  if (!state.storage && config.storage) {
    useConfig.setState({ ...config, folders: [...(config.folders ?? []), ...slot.folders.map((x) => x.props)] })
  }

  return (
    <App title="Assets" icon={<CloudIcon />} href="/assets">
      <AssetsPage>
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
      </AssetsPage>
    </App>
  )
}

const Redirect = (props: { to: string }) => {
  const [_loc, set] = useLocation()
  useEffect(() => set(props.to, { replace: true }), [props.to])
  return null
}

const AssetsPage = (props: { children: React.ReactNode }) => {
  const folders = useConfig((x) => x.folders ?? [])

  return (
    <Page>
      <Page.Breadcrumb title="Assets" icon={<CloudIcon />} href="" />
      <Page.Head>
        <div className="flex gap-4 border-t px-4 py-2 text-sm leading-none">
          {folders.map((folder) => (
            <FolderButton key={folder.path} {...folder} />
          ))}
        </div>
      </Page.Head>
      {props.children}
    </Page>
  )
}

const FolderButton = (folder: AssetFolder) => {
  const path = `/${folder.path.replace(/^\//, '')}`
  const [match] = useRoute(path)

  return (
    <Link href={path} className={cn('flex items-center gap-1.5', [match, 'text-active'])}>
      <FolderIcon className="relative -top-[1px] h-4 w-4" />
      {folder.title}
    </Link>
  )
}

Assets.Folder = setSlot('Assets.Folder', (props: AssetFolder) => <Folder {...props} />)
