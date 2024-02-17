import { DocumentIcon } from '@heroicons/react/24/outline'
import { doc } from '@firebase/firestore'
import { Card } from '@fiar/components'

import { useDocumentData, useFirestore } from '../../hooks/index.js'
import { IContentModel } from '../../schema/index.js'
import { date } from '../../util/index.js'

export const DocumentCard = (props: { model: IContentModel; titleField?: string }) => {
  const firestore = useFirestore()
  const data = useDocumentData(doc(firestore, props.model.path))
  const docData = data.data?.data()

  const createTime = (data.data as any)?._document?.createTime?.timestamp?.toDate() as Date | undefined
  const updateTime = (data.data as any)?._document?.version?.timestamp?.toDate() as Date | undefined

  const title = props.titleField ? docData?.[props.titleField] || props.model.label : props.model.label

  return (
    <Card
      icon={<DocumentIcon />}
      title={
        <span className="flex w-full items-baseline justify-between">
          <span>{title}</span>
          <span className="text-sm opacity-60">{createTime && date(createTime).format('YY/MM/DD')}</span>
        </span>
      }
    >
      <div className="flex w-full justify-between">
        <p className="pt-1 text-sm opacity-60"></p>
        <div className="flex w-full justify-end gap-3 pt-1 text-sm leading-none opacity-60">
          {data.data?.exists() ? <span>{updateTime && date(updateTime).calendar()}</span> : <span>Missing</span>}
        </div>
      </div>
    </Card>
  )
}
