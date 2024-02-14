import { Page } from '@fiar/workbench'
import { Link } from 'wouter'

import { useConfig } from '../../hooks/config.js'

export const FolderList = () => {
  const config = useConfig()

  return (
    <Page>
      <Page.Header subtitle="/" breadcrumbs={[{ children: 'Assets', href: '/' }]}></Page.Header>
      <div className="space-y-2 p-2">
        {config.folders?.map((x) => (
          <div key={x.path} className="frame border p-2">
            <Link href={x.path}>
              <a className="pb-2 leading-none">{x.title}</a>
            </Link>
            <div className="flex w-full gap-2 overflow-x-hidden pt-2">
              {Array.from({ length: 8 }).map(() => (
                <div className="frame aspect-square h-24 border"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Page>
  )
}
