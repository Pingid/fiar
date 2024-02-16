import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { collection, getCountFromServer } from '@firebase/firestore'
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
    <Link to={parameterized} className="frame hover:border-active hover:text-active block w-full border p-2">
      <p className="flex items-start gap-1 py-0.5 text-lg leading-none">
        <DocumentDuplicateIcon className="relative bottom-[1px] h-[1.15rem] w-[1.15rem]" />
        {props.label ?? path}
      </p>
      <div className="flex justify-between">
        <p className="pt-1 text-sm opacity-60">{path}</p>
        <div className="flex w-full justify-end gap-3 pt-1 text-sm leading-none opacity-60">
          <span>{draft.data?.data().count ?? '-'} Published</span>
        </div>
      </div>
    </Link>
  )
}
