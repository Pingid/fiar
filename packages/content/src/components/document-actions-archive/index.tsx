import { component } from '@fiar/workbench'
import { Button } from '@fiar/components'

import { ArchiveIcon } from '../icons/index.js'

export const ContentDocumentActionsArchive = component('content:document:actions:archive', () => {
  return (
    <Button onClick={() => console.log('archive')} icon={<ArchiveIcon className="h-4 w-4" />}>
      Archive
    </Button>
  )
})
