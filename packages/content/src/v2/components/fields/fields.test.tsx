import { userEvent } from '@testing-library/user-event'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { useForm } from 'react-hook-form'
import { expect, it, vi } from 'vitest'

import * as s from '../../schema/index.js'

import { FieldStruct } from '../index.js'

it('Should validate required values', async () => {
  const onSubmit = vi.fn()
  const Render = () => {
    const form = useForm()
    return (
      <>
        <FieldStruct
          name=""
          register={form.register}
          control={form.control}
          field={s.struct({ fields: { one: s.string({ label: 'foo' }) } })}
        />
        <button type="button" onClick={form.handleSubmit((x) => onSubmit(x))}>
          Submit
        </button>
      </>
    )
  }
  const r = render(<Render />)
  await userEvent.click(r.getByText('Submit'))

  expect(r.queryByText('Required value')).toBeInTheDocument()
  await userEvent.type(r.getByLabelText('foo'), 'Test')
  expect(r.queryByText('Required value')).not.toBeInTheDocument()
})
