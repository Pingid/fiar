import { Control, Input } from '@fiar/components'
import { component } from '@fiar/workbench'
import { useEffect, useState } from 'react'

import { useField } from '../../context/field/index.js'
import { FieldNumber } from '../../schema/index.js'

export const ContentFieldNumber = component('content:field:number', () => {
  const field = useField<FieldNumber>()
  const [value, setvalue] = useState('')

  useEffect(() => setvalue(`${field.value() || ''}`), [field.value()])

  return (
    <Control label={field.options?.label || ''} error={field.error}>
      <Input
        type="number"
        ref={field.ref}
        value={value}
        onChange={(e) => setvalue(e.target.value || '')}
        onBlur={() => {
          if (isNaN(Number(value))) return
          return field.update(Number(value))
        }}
      />
    </Control>
  )
})
