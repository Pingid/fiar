import { Link } from 'wouter'

import { useDocumentData, useDocumentRef } from '../../../lib/index.js'
import { useSelectDocument } from '../../../context/index.js'
import { IContentDocument } from '../../../schema/index.js'
import { abs } from '../../../util/index.js'

export const DocumentLink = (props: { document: IContentDocument<any, any>; children: React.ReactNode }) => {
  const ref = useDocumentRef(props.document)
  const data = useDocumentData(ref)
  const missing = !data.data?.exists()
  const path = missing ? `/create${abs(props.document.path)}` : abs(props.document.path)
  const select = useSelectDocument()
  if (select)
    return (
      <button onClick={() => select(ref)} className="w-full">
        {props.children}
      </button>
    )
  return (
    <Link to={path}>
      <a>{props.children}</a>
    </Link>
  )
}
