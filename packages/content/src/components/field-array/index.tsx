import { component, RenderComponent } from '@fiar/workbench'
import { Reorder } from '@fiar/components'

import { ContentFieldProvider, useField } from '../../context/field'
import { FieldArray } from '../../schema'
import { PlusIcon } from '../icons'

export const ContentFieldArray = component('content:field:array', () => {
  const ctx = useField<FieldArray>({ equal: (a, b) => JSON.stringify(a) === JSON.stringify(b) })
  const value: any[] = Array.isArray(ctx.value()) ? (ctx.value() as any) : []

  return (
    <div className="group/array ml-[var(--ml-left)]" ref={ctx.ref}>
      <div className="items-cetner flex items-end justify-between pb-2">
        <h4 className="group-focus-within/array:text-front/80 text-front/50 text-sm font-semibold uppercase">
          {ctx.options.label}
        </h4>
      </div>
      <div className="">
        <Reorder className="space-y-2">
          {value.map((_x, i) => (
            <ContentFieldProvider key={i} value={ctx.options.of} path={i}>
              <Reorder.Item
                index={i}
                onReorder={(from, to) => ctx.update(move(value, from, to))}
                onRemove={() => ctx.update(value.filter((_x, i2) => i !== i2))}
                className=""
              >
                <div className="">
                  <RenderComponent name={ctx.options.of.options.component} />
                </div>
              </Reorder.Item>
            </ContentFieldProvider>
          ))}
        </Reorder>
        <button
          className="bg-front/5 hover:border-active hover:text-active flex w-full items-center justify-center rounded-sm border py-1"
          onClick={() => ctx.update([...value, null])}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
})

const move = <A extends ReadonlyArray<any>>(array: A, from: number, to: number): A =>
  array.reduce(
    (prev, current, idx, self) => {
      if (from === to) prev.push(current)
      if (idx === from) return prev
      if (from < to) prev.push(current)
      if (idx === to) prev.push(self[from])
      if (from > to) prev.push(current)
      return prev
    },
    [] as any as A,
  )
