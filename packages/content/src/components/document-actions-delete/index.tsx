import { component } from '@fiar/workbench'
import useMutation from 'swr/mutation'
import { Button } from '@fiar/components'

import { useDocument } from '../../context/document/index.js'
import { TrashIcon } from '../icons/index.js'

export const ContentDocumentActionsDelete = component('content:document:actions:delete', () => {
  const item = useDocument()!
  const remove = useMutation(item.refs.draft.path, () => item.remove())
  return (
    <Button
      onClick={() => remove.trigger()}
      icon={<TrashIcon className="h-4 w-4" />}
      className="border-error text-error hover:border-error/70 hover:text-error/70 disabled:text-front disabled:border-front/30 whitespace-nowrap transition-opacity disabled:opacity-0"
    >
      Delete
    </Button>
  )
})
