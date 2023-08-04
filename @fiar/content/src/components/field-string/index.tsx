import { component } from '@fiar/workbench'
import { Control, TextArea } from '@fiar/ui'
import { useEffect, useState } from 'react'

import { useField } from '../../context/field'
import { FieldString } from '../../schema'

export const ContentFieldString = component('content:field:string', () => {
  const field = useField<FieldString>()
  const [value, setvalue] = useState('')

  useEffect(() => setvalue(field.value() || ''), [field.value()])

  return (
    <Control label={field.options?.label || ''} error={field.error}>
      <TextArea
        ref={field.ref}
        value={value}
        onChange={(e) => setvalue(e.target.value || '')}
        onBlur={() => field.update(value)}
      />
    </Control>
  )
})
