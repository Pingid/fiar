import { component } from '@fiar/workbench'
import { Button } from '@fiar/components'

import { useDocument } from '../../context/document'
import { EditIcon } from '../icons'

export const ContentDocumentActionsEdit = component('content:document:actions:edit', () => {
  const item = useDocument()!
  return (
    <Button onClick={() => item.edit()} variant="ghost" icon={<EditIcon className="h-4 w-4" />}>
      Edit
    </Button>
  )
})
