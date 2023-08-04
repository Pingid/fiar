import { Avatar, InfoCard, LoadingDots } from '@fiar/ui'
import dayjs from 'dayjs'

import { useDocument, useDocumentData } from '../../context/document'
import { DocumentIcon } from '../icons'

export const DocumentCard = (): JSX.Element => {
  const doc = useDocument()
  const status = useDocumentData((x) => x.status)
  const created = useDocumentData((x) => x.data?._meta?.created?.by)
  const updated = useDocumentData((x) => x.data?._meta?.updated?.at)
  return (
    <InfoCard
      title={doc.label || 'Untitled'}
      onClick={() => doc.select()}
      variant={['border']}
      icon={<DocumentIcon className="h-4 w-4" />}
      asside={
        <div className="flex items-center gap-1">
          <Avatar {...created} size="xs" className="relative" />{' '}
          <p className="text-front/70 group-hover:text-active">{status}</p>
        </div>
      }
    >
      <div />
      <p className="text-front/70 group-hover:text-active text-sm">
        {updated ? dayjs(updated.toDate()).format('YY/MM/DD  HH:mm') : <LoadingDots />}
      </p>
    </InfoCard>
  )
}
