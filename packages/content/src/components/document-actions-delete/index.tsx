import { component } from '@fiar/workbench'
import useMutation from 'swr/mutation'
import { Button } from '@fiar/components'

import { useDocument } from '../../context/document'
import { TrashIcon } from '../icons'

export const ContentDocumentActionsDelete = component('content:document:actions:delete', () => {
  const item = useDocument()!
  const remove = useMutation(item.refs.draft.path, () => item.remove())
  return (
    <Button onClick={() => remove.trigger()} variant="ghost:error" icon={<TrashIcon className="h-4 w-4" />}>
      Delete
    </Button>
  )
})
