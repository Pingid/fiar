import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { getCountFromServer } from '@firebase/firestore'
import { Link } from 'wouter'
import useSWR from 'swr'

import { IContentCollection } from '../../schema/index.js'
import { useCollectionRef } from '../../lib/index.js'
import { abs } from '../../util/index.js'

export const CollectionCard = (props: { collection: IContentCollection<any, any> }) => {
  const ref = useCollectionRef(props.collection)
  const draft = useSWR(ref.path + 'count', () => getCountFromServer(ref))

  return (
    <Link to={abs(props.collection.path)}>
      <a className="hover:border-active hover:text-active inline-block w-full border-b">
        <h3 className="flex gap-2 leading-none">
          <DocumentDuplicateIcon className="w-4" />
          {props.collection.label ?? props.collection.path}
        </h3>
        <div className="text-front/60 flex w-full justify-end gap-3 pb-2 pt-1 text-sm leading-none">
          <span>{draft.data?.data().count ?? '-'} Items</span>
        </div>
      </a>
    </Link>
  )
}
