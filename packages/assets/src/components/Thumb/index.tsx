import { DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export const Thumbnail = (props: { url?: string | undefined; contentType?: string | undefined }) => {
  if (props.contentType?.startsWith('video')) {
    return (
      <video controls className="h-full w-full object-scale-down object-center">
        <source src={props.url} />
        Download <a href={props.url} download target="__blank" />
      </video>
    )
  }
  if (props.contentType?.startsWith('image')) {
    return <img src={props.url} className="h-full w-full object-scale-down object-center" />
  }

  if (props.contentType?.startsWith('text') || props.contentType?.startsWith('application/pdf')) {
    return <DocumentTextIcon className="h-12 w-12" />
  }

  return <DocumentIcon className="h-12 w-12" />
}
