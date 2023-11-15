import { component } from '@fiar/workbench'
import { Button } from '@fiar/components'

import { useDocument, useDocumentData } from '../../context/document/index.js'
import { PublishIcon } from '../icons/index.js'

export const ContentDocumentActionsPublish = component('content:document:actions:publish', () => {
  const item = useDocument()!
  const status = useDocumentData((x) => x.status)
  const loading = useDocumentData((x) => x.loading)
  const error = useDocumentData((x) => x.error)

  return (
    <Button
      disabled={!!(status === 'Published' || loading || error)}
      className="border-published text-published hover:border-published/70 hover:text-published/70 disabled:text-front disabled:border-front/30 whitespace-nowrap transition-opacity disabled:opacity-0"
      onClick={() => item.publish()}
      icon={<PublishIcon className="w-4" />}
    >
      Publish
    </Button>
  )
})
