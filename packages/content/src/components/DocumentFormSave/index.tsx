import { Button } from '@fiar/components'
import { useDocumentFormContext } from '../../context/document.js'

export const DocumentPublish = (props: { title: string; icon: React.ReactNode; onClick: () => void }) => {
  const form = useDocumentFormContext()
  const disabled = !form.formState.isDirty || form.formState.isLoading

  return (
    <Button type="submit" size="sm" color="published" icon={props.icon} onClick={props.onClick} disabled={disabled}>
      {props.title}
    </Button>
  )
}
