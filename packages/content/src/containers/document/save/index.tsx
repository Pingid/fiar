import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Button } from '@nextui-org/react'

import { useFormContext } from '../../../context/field.js'

export const DocumentPublish = (props: { title: string; onClick: () => void }) => {
  const form = useFormContext()
  const loading = form.formState.isLoading || form.formState.isSubmitting
  return (
    <Button
      type="submit"
      color={'success'}
      variant="bordered"
      startContent={!loading && <ArrowUpTrayIcon className="!h-4 !w-4" />}
      onClick={props.onClick}
      isLoading={loading}
    >
      {props.title}
    </Button>
  )
}
