import { FolderIcon, FolderOpenIcon } from '@heroicons/react/24/outline'
import { Page } from '@fiar/workbench'
import { Link } from 'wouter'

import { useUploads } from '../../hooks/uploads.js'
import { useConfig } from '../../hooks/config.js'
import { Upload } from '../index.js'

export const FolderList = () => {
  const config = useConfig()
  const uploads = useUploads((x) => x.uploads)

  return (
    <Page>
      <Page.Header breadcrumbs={[{ children: 'Assets', href: '/' }]}></Page.Header>
      {uploads.length > 0 && (
        <div className="flex w-full gap-2 overflow-x-auto border-b p-2">
          {uploads.map((x) => (
            <Upload key={x.fullPath} {...x} />
          ))}
        </div>
      )}
      <div className="space-y-2 p-2">
        {config.folders?.map((x) => (
          <Link key={x.path} href={x.path}>
            <a className="frame hover:border-active group block w-full border p-2">
              <p className="flex items-start gap-2 py-0.5 text-lg leading-none">
                <FolderIcon className="relative bottom-[1px] h-[1.15rem] w-[1.15rem] group-hover:hidden" />
                <FolderOpenIcon className="relative bottom-[1px] hidden h-[1.15rem] w-[1.15rem] group-hover:block" />
                {x.title}
              </p>
              <p className="text-front/60 pt-1 text-sm">{x.path}</p>
            </a>
          </Link>
        ))}
      </div>
    </Page>
  )
}
