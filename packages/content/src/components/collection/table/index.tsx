import { ChevronDownIcon, TrashIcon } from '@heroicons/react/24/outline'
import { OrderByDirection, doc, orderBy } from '@firebase/firestore'
import { useEffect, useState } from 'react'
import { useStore } from 'zustand'
import { cn } from 'mcn'

import { useLocation } from '@fiar/workbench/router'
import { Button } from '@fiar/components'

import { useCollectionData, useCollectionRef, useDocumentMutation } from '../../../context/data.js'
import { useSelectDocument } from '../../../context/select.js'
import { useQueryStore } from '../../../context/query.js'
import { FieldPreview } from '../../../context/field.js'
import { useModel } from '../../../context/model.js'

export const Table = () => {
  const schema = useModel<'collection'>()
  const data = useCollectionData()
  const [columns] = useState(schema.columns)
  const select = useSelectDocument()
  const [location, nav] = useLocation()
  const store = useQueryStore()
  const update = useDocumentMutation()
  const ref = useCollectionRef()

  useEffect(() => {
    if (schema.sort) store.getState().constrain('orderBy', orderBy(schema.sort[0], schema.sort[1]))
  }, [schema.sort, store])

  return (
    <div
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(50px,1fr)) 6rem` }}
      className="grid w-full gap-x-6 p-2 [grid-auto-rows:auto] sm:p-0 "
    >
      <div className="bg-front/5 col-span-full hidden w-full grid-cols-subgrid px-3 py-1 pt-2 sm:grid">
        {columns.map((key: string, i) => (
          <div key={key} className={cn('text-front/60 flex gap-2 text-sm font-medium', [i === 0, 'col-span-1'])}>
            <span>{schema.fields[key]?.label || key}</span>
            <Order value={key} />
          </div>
        ))}
      </div>
      {data.data?.docs.map((x) => (
        <div
          key={x.id}
          role="button"
          onClick={() => (select ? select(x.ref) : nav(`${location}/${x.id}`))}
          className="hover:text-active active hover:border-active group col-span-full mb-2 grid border p-3 sm:grid-cols-subgrid sm:border-x-0 sm:border-b-0"
        >
          {columns.map((key: string) => (
            <div key={key} className="mb-2 flex w-full min-w-0 flex-col sm:mb-0">
              <p className="text-front/60 pb-0.5 text-xs leading-none sm:hidden">{schema.fields[key]?.label || key}</p>
              <FieldPreview name={key} schema={schema.fields[key] as any} value={x.data()[key]} />
            </div>
          ))}
          <div className="flex w-full items-start justify-end">
            <div className="hidden gap-1 sm:flex">
              <Button
                icon={<TrashIcon />}
                size="sm"
                color="error"
                onClick={(e) => (e.stopPropagation(), update.trigger({ type: 'delete', schema, ref: doc(ref, x.id) }))}
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

export const useOrderBy = (v: string) => {
  const store = useQueryStore()
  const constraints = useStore(store, (x) => x.constraints)
  const constrain = useStore(store, (x) => x.constrain)
  const value = constraints.find((y) => y.type === 'orderBy')
  const active = (value as any)?._field?.segments.join('.') === v
  const dir = (value as any)?._direction || ('desc' as OrderByDirection)
  const next = active ? (dir === 'asc' ? 'desc' : 'asc') : 'asc'
  const toggle = () => (constrain('orderBy', orderBy(v, next)), constrain('startAfter'))
  return [active, active ? dir : 'asc', toggle] as const
}
