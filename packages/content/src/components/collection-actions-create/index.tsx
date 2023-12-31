import { component } from '@fiar/workbench'
import { Button } from '@fiar/components'

import { useCollection } from '../../context/collection'
import { CreateDocumentIcon } from '../icons'

export const ContentCollectionActionsCreate = component('collection:actions:create', () => {
  const col = useCollection()!
  return (
    <Button variant="ghost" size="none" icon={<CreateDocumentIcon className="w-4" />} onClick={() => col.add()}>
      Create
    </Button>
  )
})
