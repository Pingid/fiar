import { collection, getCountFromServer } from '@firebase/firestore'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { Card } from '@fiar/components'
import { Link } from 'wouter'
import useSWR from 'swr'

import { parameterize, trailing } from '../../util/index.js'
import { IContentCollection } from '../../schema/index.js'
import { useFirestore } from '../../hooks/index.js'

export const CollectionCard = (props: IContentCollection) => {
  const path = trailing(props.path)
  const parameterized = parameterize(path)
  const ref = collection(useFirestore(), path)
  const draft = useSWR(ref.path + 'count', () => getCountFromServer(ref))

  return (
    <Link to={parameterized} asChild>
      <Card icon={<DocumentDuplicateIcon />} title={props.label ?? path} elementType="a" className="block">
        <div className="flex justify-between">
          <p className="pt-1 text-sm opacity-60">{path}</p>
          <div className="flex w-full justify-end gap-3 pt-1 text-sm leading-none opacity-60">
            <span>{draft.data?.data().count ?? '-'} Published</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
