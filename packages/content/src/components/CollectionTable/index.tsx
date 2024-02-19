import { QueryDocumentSnapshot } from '@firebase/firestore'

import { useCollectionListData } from '../CollectionList/index.js'
import { IContentCollection } from '../../schema/index.js'
import { date } from '../../util/index.js'

const TITLE = Symbol('Title')
const CREATED_AT = Symbol('Created At')
const UPDATED_AT = Symbol('Updated At')

export const CollectionTable = (props: { schema: IContentCollection; path: string }) => {
  const data = useCollectionListData(props.path)

  const columns = [TITLE, CREATED_AT, UPDATED_AT]

  const style = {
    gridTemplateColumns: `minmax(.5fr,max-content) minmax(50px,max-content) minmax(50px,max-content)`,
  }

  return (
    <ul className="grid w-full gap-2" style={style}>
      <li
        className="col-span-3 hidden w-full border-b px-3 sm:grid sm:[grid-template-columns:subgrid]"
        style={{ gridColumn: `span ${columns.length}` }}
      >
        {columns.map((x) => (
          <Header key={x.toString()} column={x} />
        ))}
      </li>
      {data.data?.docs.map((x) => (
        <li
          key={x.id}
          className="col-span-3 grid px-3 sm:[grid-template-columns:subgrid]"
          style={{ gridColumn: `span ${columns.length}` }}
        >
          {columns.map((c) => (
            <Column key={c.toString()} schema={props.schema} column={c} data={x} />
          ))}
        </li>
      ))}
    </ul>
  )
}

const Header = (props: { column: string | symbol }) => {
  const cls = 'whitespace-nowrap text-sm font-medium'
  if (typeof props.column === 'symbol') return <p className={cls}>{props.column.description}</p>
  return <p className={cls}>{props.column}</p>
}

const Column = (props: {
  schema: IContentCollection
  column: string | symbol
  data: QueryDocumentSnapshot<any, any>
}) => {
  if (props.column === TITLE) {
    return <p className="sm:truncate">{props.data.data()[props.schema.titleField]}</p>
  }
  if (props.column === CREATED_AT) {
    return (
      <p className="truncate text-sm">
        {date((props.data as any)?._document?.createTime?.timestamp?.toDate() as Date).calendar()}
      </p>
    )
  }
  if (props.column === UPDATED_AT) {
    return (
      <p className="truncate text-sm">
        {date((props.data as any)?._document?.version?.timestamp?.toDate() as Date).calendar()}
      </p>
    )
  }
  return <p className="truncate">{props.data.data()[props.column]}</p>
}
