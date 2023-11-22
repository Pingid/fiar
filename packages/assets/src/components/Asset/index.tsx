import { DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { useMemo } from 'react'
import { cn } from 'mcn'

import { is_image, is_pdf, is_video } from '../../hooks/index.js'

export type AssetPreview = typeof Asset
export const Asset = (p: { url?: string | undefined; loading?: boolean; name?: string }): JSX.Element => {
  const type = useMemo(() => {
    let name = ''
    try {
      name = p.name ? p.name : p.url ? new URL(p.url).pathname : ''
    } catch (e) {
      return 'other'
    }
    if (!name) return 'other'
    if (is_image.test(name)) return 'image'
    if (is_pdf.test(name)) return 'pdf'
    if (is_video.test(name)) return 'video'
    return 'other'
  }, [p.url])

  if (type === 'image')
    return (
      <img
        src={p.url}
        className={cn('max-h-full w-full object-contain transition delay-100', [p.loading, 'opacity-0', 'opacity-100'])}
      />
    )

  if (type === 'pdf') return <DocumentTextIcon className="h-16 w-16" />

  if (type === 'video') {
    return (
      <video
        controls
        className={cn('max-h-full w-full object-contain transition delay-100', [p.loading, 'opacity-0', 'opacity-100'])}
      >
        <source src={p.url} />
        Download <a href={p.url} download target="__blank" />
      </video>
    )
  }
  return <DocumentIcon className="h-16 w-16" />
}
