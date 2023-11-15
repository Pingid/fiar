import { component } from '@fiar/workbench'
import { Button } from '@fiar/components'

import { useCollection } from '../../context/collection/index.js'
import { CreateDocumentIcon } from '../icons/index.js'

export const ContentCollectionActionsCreate = component('collection:actions:create', () => {
  const col = useCollection()!
  return (
    <Button
      icon={<CreateDocumentIcon className="w-4" />}
      onClick={() => col.add()}
      className="border-active text-active hover:border-active/70 hover:text-active/70 disabled:text-front disabled:border-front/30 whitespace-nowrap transition-opacity disabled:opacity-0"
    >
      Create
    </Button>
  )
})
