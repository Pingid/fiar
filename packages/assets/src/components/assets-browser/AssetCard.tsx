import { LoadingDots, ErrorMessage } from '@fiar/components'
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
        'relative grid w-full [grid-template-rows:max-content_1fr]',
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
      <div className="grid border-b px-3 pb-2 pt-2 leading-none [grid-template-columns:1fr_max-content]">
        <p className="text-front/60 w-full truncate pr-1 pt-1 text-sm leading-none">
          <a href={p.link} target="__blank" className={cn('flex-1 truncate', [!!p.link, 'hover:text-active'])}>
            {p.name}
          </a>
        </p>
        <div className="flex-0">{p.menu}</div>
      </div>
      <div className={cn('flex aspect-square items-center justify-center', [!p.embedded, 'bg-front/5'])}>
        {p.children}
      </div>
      <div className={cn('absolute inset-0 items-center justify-center p-2', [!!p.error, 'flex', 'hidden'])}>
        <ErrorMessage>{p.error}</ErrorMessage>
      </div>
      <div className={cn('absolute inset-0 items-center justify-center', [p.loading, 'flex', 'hidden'])}>
        <div>
          <span className="text-xl">
            <LoadingDots />
          </span>
        </div>
      </div>
    </div>
  )
}
