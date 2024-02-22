import { DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

import { Thumb3D } from './3D/index.js'

export const Thumbnail = (props: { url?: string | undefined; contentType?: string | undefined; className: string }) => {
  if (!props.url) return null

  if (new URL(props.url).pathname.endsWith('.glb') || new URL(props.url).pathname.endsWith('.gltf')) {
    return <Thumb3D url={props.url} />
  }

  if (props.contentType?.startsWith('video')) {
    return (
      <video controls className={props.className}>
        <source src={props.url} />
        Download <a href={props.url} download target="__blank" />
      </video>
    )
  }

  if (props.contentType?.startsWith('image')) {
    return <img loading="lazy" src={props.url} className={props.className} />
  }

  if (props.contentType?.startsWith('text') || props.contentType?.startsWith('application/pdf')) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <DocumentTextIcon className="h-12 w-12" />
      </div>
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <DocumentIcon className="h-12 w-12" />
    </div>
  )
}
