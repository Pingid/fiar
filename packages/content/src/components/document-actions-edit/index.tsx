import { component } from '@fiar/workbench'
import { Button } from '@fiar/components'

import { useDocument } from '../../context/document/index.js'
import { EditIcon } from '../icons/index.js'

export const ContentDocumentActionsEdit = component('content:document:actions:edit', () => {
  const item = useDocument()!
  return (
    <Button onClick={() => item.edit()} icon={<EditIcon className="h-4 w-4" />}>
      Edit
    </Button>
  )
})
