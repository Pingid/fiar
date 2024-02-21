import { ChevronDownIcon, DocumentIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '@fiar/components'
import { useLocation } from 'wouter'
import { useEffect, useState } from 'react'
import { cn } from 'mcn'

import { IContentCollection, IFields } from '../../../schema/index.js'
import { useCollectionListData, useCollectionQuery, useOrderBy } from '../hooks/index.js'
import { useSelectDocument } from '../../../context/select.js'
import { date } from '../../../util/index.js'
import { orderBy } from '@firebase/firestore'

export const Table = (props: IContentCollection) => {
  const [columns] = useState(props.columns)
  const data = useCollectionListData(props.path)
  const select = useSelectDocument()
  const [_, nav] = useLocation()

  useEffect(() => {
    if (columns[0]) useCollectionQuery.getState().update('orderBy', orderBy(columns[0], 'desc'))
  }, [])

  return (
    <div
      style={{ gridTemplateColumns: `max-content repeat(${columns.length}, minmax(50px,1fr)) 6rem` }}
      className="grid w-full gap-x-2 p-2 [grid-auto-rows:auto] sm:p-0"
    >
      <div className="bg-front/5 col-span-full hidden w-full grid-cols-subgrid px-3 py-1 pt-2 sm:grid">
        {columns.map((key: string, i) => (
          <div key={key} className={cn('text-front/60 flex gap-2 text-sm font-medium', [i === 0, 'col-span-2'])}>
            <span>{props.fields[key]?.label || key}</span>
            <Order value={key} />
          </div>
        ))}
      </div>
      {data.data?.docs.map((x) => (
        <div
          key={x.id}
          role="button"
          onClick={() => (select ? select(x.ref) : nav(`${props.path}/${x.id}`))}
          className="hover:text-active active hover:border-active group col-span-full mb-2 grid border p-3 sm:grid-cols-subgrid sm:border-x-0 sm:border-b-0"
        >
          <div>
            <DocumentIcon className="group-hover:text-active h-5 w-5" />
          </div>
          {columns.map((key: string) => (
            <div key={key} className="mb-2 flex w-full min-w-0 flex-col  sm:mb-0">
              <p className="text-front/60 text-xs leading-none sm:hidden">{props.fields[key]?.label || key}</p>
              <FieldPreview field={props.fields[key] as any} data={x.data()[key]} />
            </div>
          ))}
          <div className="flex w-full items-start justify-end">
            <div className="hidden gap-1 sm:flex">
              <Button icon={<TrashIcon />} size="sm" color="error"></Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const Order = (props: { value: string }) => {
  const [active, dir, toggle] = useOrderBy(props.value)
  return (
    <button
      className={cn('hover:text-active hover:opacity-100', [active, 'text-active', 'opacity-50'])}
      onClick={toggle}
    >
      <ChevronDownIcon className={cn('h-4 w-4', [dir === 'asc' && active, 'rotate-180'])} />
    </button>
  )
}

const FieldPreview = (props: { field: IFields; data: any }) => {
  if (props.field.component === 'field:text') {
    return <div dangerouslySetInnerHTML={{ __html: props.data }} className="line-clamp-3 text-sm" />
  }
  if (props.field.type === 'bool') return props.data
  if (props.field.type === 'number') return props.data
  if (props.field.type === 'string') return props.data
  if (props.field.type === 'timestamp') return date(props.data.toDate()).calendar()
  return <div className="truncate">{JSON.stringify(props.data)}</div>
}
