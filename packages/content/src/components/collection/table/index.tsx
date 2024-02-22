import { ChevronDownIcon, TrashIcon } from '@heroicons/react/24/outline'
import { QueryDocumentSnapshot, deleteDoc, orderBy } from '@firebase/firestore'
import { useEffect, useState } from 'react'
import { Button } from '@fiar/components'
import { useLocation } from 'wouter'
import { cn } from 'mcn'

import { useCollectionQuery, useOrderBy } from '../hooks/index.js'
import { useSelectDocument } from '../../../context/select.js'
import { IContentCollection } from '../../../schema/index.js'
import { PreviewField } from '../../../fields/index.js'

export const Table = (props: IContentCollection & { docs: QueryDocumentSnapshot[] }) => {
  const [columns] = useState(props.columns)
  const select = useSelectDocument()
  const [_, nav] = useLocation()

  useEffect(() => {
    if (props.sort) useCollectionQuery.getState().update('orderBy', orderBy(props.sort[0], props.sort[1]))
  }, [props.sort])

  return (
    <div
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(50px,1fr)) 6rem` }}
      className="grid w-full p-2 [grid-auto-rows:auto] sm:p-0"
    >
      <div className="bg-front/5 col-span-full hidden w-full grid-cols-subgrid px-3 py-1 pt-2 sm:grid">
        {columns.map((key: string, i) => (
          <div key={key} className={cn('text-front/60 flex gap-2 text-sm font-medium', [i === 0, 'col-span-1'])}>
            <span>{props.fields[key]?.label || key}</span>
            <Order value={key} />
          </div>
        ))}
      </div>
      {props.docs.map((x) => (
        <div
          key={x.id}
          role="button"
          onClick={() => (select ? select(x.ref) : nav(`${props.path}/${x.id}`))}
          className="hover:text-active active hover:border-active group col-span-full mb-2 grid border p-3 sm:grid-cols-subgrid sm:border-x-0 sm:border-b-0"
        >
          {columns.map((key: string) => (
            <div key={key} className="mb-2 flex w-full min-w-0 flex-col sm:mb-0">
              <p className="text-front/60 pb-0.5 text-xs leading-none sm:hidden">{props.fields[key]?.label || key}</p>
              <PreviewField name={key} field={props.fields[key] as any} value={x.data()[key]} />
            </div>
          ))}
          <div className="flex w-full items-start justify-end">
            <div className="hidden gap-1 sm:flex">
              <Button
                icon={<TrashIcon />}
                size="sm"
                color="error"
                onClick={(e) => (e.stopPropagation(), deleteDoc(x.ref))}
              ></Button>
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
