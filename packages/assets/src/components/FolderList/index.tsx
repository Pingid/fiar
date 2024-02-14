import { Page } from '@fiar/workbench'
import { Link } from 'wouter'

import { AssetFolder, useConfig } from '../../hooks/config.js'
import { useAssetList } from '../../hooks/data.js'
import { AssetPreviewCard } from '../index.js'

export const FolderList = () => {
  const config = useConfig()

  return (
    <Page>
      <Page.Header subtitle="/" breadcrumbs={[{ children: 'Assets', href: '/' }]}></Page.Header>
      <div className="space-y-2 p-2">{config.folders?.map((x) => <Folder key={x.path} {...x} />)}</div>
    </Page>
  )
}

const Folder = (props: AssetFolder) => {
  const items = useAssetList(props.path, { maxResults: 10 })

  return (
    <div className="frame border p-2">
      <Link href={props.path}>
        <a className="pb-2 leading-none">{props.title}</a>
      </Link>
      <div className="flex w-full gap-2 overflow-x-hidden pt-2">
        {items.data?.items.map((x) => (
          <div className="aspect-square h-40">
            <AssetPreviewCard key={x.fullPath} asset={x} remove={() => {}} />
          </div>
        ))}
      </div>
    </div>
  )
}
