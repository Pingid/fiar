import { DocumentIcon } from '@heroicons/react/24/outline'
import { Link } from 'wouter'
import { cn } from 'mcn'

import { useDocumentData, useDocumentRef } from '../../lib/index.js'
import { useSelectDocument } from '../../context/index.js'
import { IContentDocument } from '../../schema/index.js'
import { abs, date } from '../../util/index.js'

export const DocumentCard = (props: { document: IContentDocument<any, any>; titleField?: string }) => {
  const data = useDocumentData(useDocumentRef(props.document))
  const docData = data.data?.data()
  const missing = !data.data?.exists()

  const createTime = (data.data as any)?._document?.createTime?.timestamp?.toDate() as Date | undefined
  const updateTime = (data.data as any)?._document?.version?.timestamp?.toDate() as Date | undefined

  return (
    <div className={cn('hover:border-active hover:text-active inline-block w-full border-b', [missing, 'opacity-70'])}>
      <div className="flex justify-between gap-3 leading-none">
        <div className="flex gap-2">
          <DocumentIcon className="w-4 flex-shrink-0 self-start" />
          <h3 className="-mt-1 leading-normal">
            {missing && `(create) `}
            {props.titleField ? docData?.[props.titleField] || props.document.label : props.document.label}
          </h3>
        </div>
        <span className="text-front/60 text-xs ">{createTime && date(createTime).format('YY/MM/DD')}</span>
      </div>
      <div className="text-front/60 flex w-full justify-end gap-3 pb-2 pt-2 text-sm text-xs">
        {data.data?.exists() ? <span>{updateTime && date(updateTime).calendar()}</span> : <span>Missing</span>}
      </div>
    </div>
  )
}

export const DocumentLink = (props: { document: IContentDocument<any, any>; children: React.ReactNode }) => {
  const ref = useDocumentRef(props.document)
  const data = useDocumentData(ref)
  const missing = !data.data?.exists()
  const path = missing ? `/create${abs(props.document.path)}` : abs(props.document.path)
  const select = useSelectDocument()
  if (select)
    return (
      <button onClick={() => select(ref)} className="w-full">
        {props.children}
      </button>
    )
  return (
    <Link to={path}>
      <a>{props.children}</a>
    </Link>
  )
}
