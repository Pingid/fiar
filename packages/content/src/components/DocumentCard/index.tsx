import { DocumentIcon } from '@heroicons/react/24/outline'
import { doc } from '@firebase/firestore'
import { cn } from 'mcn'

import { useDocumentData, useFirestore } from '../../hooks/index.js'
import { IContentModel } from '../../schema/index.js'
import { date } from '../../util/index.js'

export const DocumentCard = (props: { model: IContentModel; titleField?: string }) => {
  const firestore = useFirestore()
  const data = useDocumentData(doc(firestore, props.model.path))
  const docData = data.data?.data()
  const missing = !data.data?.exists()

  const createTime = (data.data as any)?._document?.createTime?.timestamp?.toDate() as Date | undefined
  const updateTime = (data.data as any)?._document?.version?.timestamp?.toDate() as Date | undefined

  const title = props.titleField ? docData?.[props.titleField] || props.model.label : props.model.label

  return (
    <div
      className={cn('hover:border-active hover:text-active bg-frame inline-block w-full border-b p-2', [
        missing,
        'opacity-70',
      ])}
    >
      <div className="flex justify-between gap-3 leading-none">
        <div className="flex gap-2">
          <DocumentIcon className="w-4 flex-shrink-0 self-start" />
          <h3 className="-mt-0.5 leading-normal">{title}</h3>
        </div>
        <span className="text-front/60 text-xs ">{createTime && date(createTime).format('YY/MM/DD')}</span>
      </div>
      <div className="text-front/60 flex w-full justify-end gap-3 pt-2 text-sm text-xs">
        {data.data?.exists() ? <span>{updateTime && date(updateTime).calendar()}</span> : <span>Missing</span>}
      </div>
    </div>
  )
}
