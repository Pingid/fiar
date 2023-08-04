import UploadIcon from '@heroicons/react/24/outline/CloudArrowUpIcon'

import cn from 'mcn'

export const DropLayer = (p: { active: boolean }): JSX.Element => {
  const active = p.active
  return (
    <>
      <div
        className={cn('absolute inset-0 transition', [
          active,
          'opacity-100 backdrop-blur',
          'pointer-events-none opacity-0',
        ])}
      />
      <div
        className={cn('bg-back absolute inset-0 transition-opacity', [
          active,
          'opacity-70',
          'pointer-events-none opacity-0',
        ])}
      />

      <div
        className={cn('absolute inset-0 left-0 top-0 flex items-center justify-center transition', [
          active,
          'translate-y-0 opacity-100',
          'pointer-events-none translate-y-6 opacity-0',
        ])}
      >
        <h1 className="text-active flex items-center gap-2 text-xl">
          <UploadIcon className="h-8 w-8" />
          <span>Upload</span>
        </h1>
      </div>
    </>
  )
}
