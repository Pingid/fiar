import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { cn } from 'mcn'

export const DropLayer = (p: { isDragActive: boolean; isDragAccept: boolean; isDragReject: boolean }): JSX.Element => {
  const active = p.isDragActive
  return (
    <>
      <div
        className={cn('fixed inset-0 z-10 transition', [
          active,
          'opacity-100 backdrop-blur',
          'pointer-events-none opacity-0',
        ])}
      />
      <div
        className={cn('bg-back fixed inset-0 z-10 transition-opacity', [
          active,
          'opacity-70',
          'pointer-events-none opacity-0',
        ])}
      />
      <div className={cn('fixed inset-0 left-0 top-0 z-10 overflow-hidden', [!active, 'pointer-events-none'])}>
        <div
          className={cn('flex h-full w-full items-center justify-center transition', [
            active,
            'translate-y-0 opacity-100',
            'pointer-events-none translate-y-6 opacity-0',
          ])}
        >
          <h1 className="text-active flex items-center gap-2 text-xl">
            <CloudArrowUpIcon className="h-8 w-8" />
            <span>Upload</span>
          </h1>
        </div>
      </div>
    </>
  )
}
