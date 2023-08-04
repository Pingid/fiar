import { LoadingDots } from '@fiar/components'
import { cn } from 'mcn'

export const AssetCard = (p: {
  loading?: boolean
  error?: string
  link?: string | undefined
  children?: React.ReactNode
  menu?: React.ReactNode
  embedded?: boolean
  onClick?: (() => void) | undefined
  name: string
}): JSX.Element => {
  return (
    <div
      className={cn(
        'flex aspect-square w-full flex-col',
        [!!p.onClick, 'hover:border-active'],
        [!!p.embedded, '', 'rounded-md border'],
      )}
      role={p.onClick ? 'button' : 'article'}
      onClick={p.onClick}
      onFocus={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <div className="flex items-end justify-between border-b px-3 pb-2 pt-2 leading-none">
        <p className="text-front/60 w-full truncate pb-[2px] text-sm leading-none">
          <a href={p.link} target="__blank" className={cn([!!p.link, 'hover:text-active'])}>
            {p.name}
          </a>
        </p>
        {p.menu}
      </div>
      <div
        className={cn('relative flex aspect-square h-full w-full items-center justify-center', [
          !p.embedded,
          'bg-front/5',
        ])}
      >
        {p.children}
        <div className={cn('absolute inset-0 items-center justify-center', [!!p.error, 'flex', 'hidden'])}>
          <div className="text-error">{p.error}</div>
        </div>
        <div className={cn('absolute inset-0 items-center justify-center', [p.loading, 'flex', 'hidden'])}>
          <div>
            <span className="text-xl">
              <LoadingDots />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
