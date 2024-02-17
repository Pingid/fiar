import { DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { cn } from 'mcn'

import { Thumb3D } from './3D/index.js'

export const Thumbnail = (props: {
  url?: string | undefined
  contentType?: string | undefined
  className?: string
}) => {
  return (
    <div className={cn('flex items-center justify-center', props.className)}>
      <ThumbMedia {...props} />
    </div>
  )
}

const ThumbMedia = (props: { url?: string | undefined; contentType?: string | undefined }) => {
  if (!props.url) return null

  if (new URL(props.url).pathname.endsWith('.glb') || new URL(props.url).pathname.endsWith('.gltf')) {
    return <Thumb3D url={props.url} />
  }

  if (props.contentType?.startsWith('video')) {
    return (
      <video controls className="h-full w-full object-contain object-center">
        <source src={props.url} />
        Download <a href={props.url} download target="__blank" />
      </video>
    )
  }
  if (props.contentType?.startsWith('image')) {
    return <img loading="lazy" src={props.url} className="h-full w-full object-contain object-center" />
  }

  if (props.contentType?.startsWith('text') || props.contentType?.startsWith('application/pdf')) {
    return <DocumentTextIcon className="h-12 w-12" />
  }

  return <DocumentIcon className="h-12 w-12" />
}
