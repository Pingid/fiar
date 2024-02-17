import { FolderIcon, FolderOpenIcon } from '@heroicons/react/24/outline'
import { Header } from '@fiar/workbench'
import { Card } from '@fiar/components'
import { Link } from 'wouter'

import { useUploadStatus, useUploads } from '../../context/uploads.js'
import { useAssetConfig } from '../../context/config.js'
import { Upload } from '../index.js'

export const FolderList = () => {
  const config = useAssetConfig()
  const uploads = useUploads((x) => x.uploads)
  useUploadStatus()
  return (
    <>
      <Header breadcrumbs={[{ children: 'Assets', href: '/' }]}></Header>
      {uploads.length > 0 && (
        <div className="relative z-10 flex w-full gap-2 overflow-x-auto border-b p-2">
          {uploads.map((x) => (
            <Upload key={x.fullPath} {...x} />
          ))}
        </div>
      )}
      <div className="space-y-2 p-2">
        {config.folders?.map((x) => (
          <Link key={x.path} href={x.path} asChild>
            <Card
              elementType="a"
              className="block"
              icon={
                <>
                  <FolderIcon className="relative group-hover/card:hidden" />
                  <FolderOpenIcon className="relative hidden group-hover/card:block" />
                </>
              }
              title={x.title}
            >
              <p className="text-front/60 pt-1 text-sm">{x.path}</p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
