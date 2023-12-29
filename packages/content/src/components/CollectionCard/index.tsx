import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { collection, getCountFromServer } from '@firebase/firestore'
import { Link } from 'wouter'
import useSWR from 'swr'

import { IContentCollection } from '../../schema/index.js'
import { useFirestore } from '../../hooks/index.js'

const parameterize = (path: string) => trailing(path).replace(/\{([^\}]+)\}/g, ':$1')
const trailing = (path: string) => path.replace(/\/\{[^\}]+\}$/, '')

export const CollectionCard = (props: IContentCollection) => {
  const path = trailing(props.path)
  const parameterized = parameterize(path)
  const ref = collection(useFirestore(), path)
  const draft = useSWR(ref.path + 'count', () => getCountFromServer(ref))

  return (
    <Link to={parameterized}>
      <a className="hover:border-active hover:text-active bg-frame inline-block w-full rounded border-b p-2">
        <h3 className="flex gap-2 leading-none">
          <DocumentDuplicateIcon className="w-4" />
          {props.label ?? path}
        </h3>
        <div className="text-front/60 flex w-full justify-end gap-3 pt-1 text-sm leading-none">
          <span>{draft.data?.data().count ?? '-'} Items</span>
        </div>
      </a>
    </Link>
  )
}
