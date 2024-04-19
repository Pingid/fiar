import { FolderIcon, FolderOpenIcon } from '@heroicons/react/24/outline'
import { LinkCard } from '@fiar/content/components'
import { Header } from '@fiar/workbench'

import { useAssetConfig } from '../../context/config.js'
import { useUploads } from '../../context/uploads.js'
import { Upload } from '../index.js'

export const FolderList = () => {
  const config = useAssetConfig()
  const uploads = useUploads((x) => x.uploads)

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
          <LinkCard
            key={x.path}
            href={x.path}
            icon={
              <>
                <FolderIcon className="relative group-hover/card:hidden" />
                <FolderOpenIcon className="relative hidden group-hover/card:block" />
              </>
            }
            label={x.title}
            subheader={x.path}
          ></LinkCard>
        ))}
      </div>
    </>
  )
}
