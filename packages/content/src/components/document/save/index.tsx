import { Button } from '@fiar/components'

import { useFormContext } from '../../../context/field.js'

export const DocumentPublish = (props: { title: string; icon: React.ReactNode; onClick: () => void }) => {
  const form = useFormContext()
  const disabled = !form.formState.isDirty || form.formState.isLoading

  return (
    <Button type="submit" color="published" icon={props.icon} onClick={props.onClick} disabled={disabled}>
      {props.title}
    </Button>
  )
}
