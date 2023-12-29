import { CloudArrowUpIcon, FolderIcon } from '@heroicons/react/24/outline'
import { DropzoneState } from 'react-dropzone'
import { Button } from '@fiar/components'
import { Page } from '@fiar/workbench'
import { Link } from 'wouter'
import { cn } from 'mcn'

import { useConfig } from '../../hooks/config.js'

export const AssetsHeader = (props: { zone: DropzoneState; title: string; path: string }) => {
  const folders = useConfig((x) => x.folders ?? [])

  return (
    <Page.Header
      breadcrumbs={[
        { children: 'Assets', href: '/' },
        { children: props.title, href: props.path },
      ]}
    >
      <div className="flex w-full items-end justify-between">
        <div className="flex gap-3 overflow-x-auto">
          {folders.map((x) => (
            <Link href={x.path} key={x.path}>
              <a className={cn('text-xl', [props.path === x.path, 'text-front', 'text-front/50'])}>
                <FolderIcon className="-mt-1.5 mr-2 inline h-6 w-6" />
                {x.title}
              </a>
            </Link>
          ))}
        </div>
        <Button
          icon={<CloudArrowUpIcon className="mr-1 h-5 w-5" />}
          elementType="label"
          htmlFor="upload"
          color="active"
          className="flex-0"
        >
          Upload
        </Button>
        <input id="upload" {...props.zone.getInputProps()} className="hover:bg-highlight rounded text-lg font-medium" />
      </div>
    </Page.Header>
  )
}
