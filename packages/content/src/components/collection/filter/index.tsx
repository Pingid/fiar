import { Input, Select } from '@fiar/components'
import { useState } from 'react'
import { cn } from 'mcn'

import { IContentCollection } from '../../../schema/index.js'

export const Filter = (props: IContentCollection) => {
  const [changine, setChanging] = useState(false)
  const bins = ['==', '>', '<', '<=', '!=', '>=']
  // const arr = ['array-contains', 'in', 'array-contains-any', 'not-in']

  return (
    <div className="flex items-start gap-1">
      <button onClick={() => setChanging(!changine)} className="h-7 whitespace-nowrap leading-none">
        Where
      </button>
      ({!changine && '...'}
      {changine && (
        <>
          <div className="bg-front/5 focus-within:outline-active h-6 pr-1 focus-within:outline">
            <Select className="h-full w-min px-0.5 focus:outline-none">
              <option>...</option>
              {Object.keys(props.fields).map((label) => (
                <option value={label} key={label}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div
            className={cn('bg-front/5 focus-within:outline-active h-6 pr-1 focus-within:outline', [true, 'opacity-15'])}
          >
            <Select className="h-full w-min px-0.5 focus:outline-none">
              {bins.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </Select>
          </div>
          <Input className="bg-front/5 h-7" />
        </>
      )}
      )
    </div>
  )
}
