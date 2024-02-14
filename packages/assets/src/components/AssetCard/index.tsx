import { LoadingDots, ErrorMessage } from '@fiar/components'
import { cn } from 'mcn'

export const AssetCard = (p: {
  loading?: boolean
  error?: string
  link?: string | undefined
  children?: React.ReactNode
  actions?: React.ReactNode
  onClick?: (() => void) | undefined
  name: string
}): JSX.Element => {
  return (
    <div
      className={cn('bg-frame frame relative grid w-full border [grid-template-rows:max-content_1fr]', [
        !!p.onClick,
        'hover:border-active',
      ])}
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
        <div className="flex-0 flex items-center justify-center gap-1">{p.actions}</div>
      </div>
      <div className={cn('flex aspect-square items-center justify-center')}>{p.children}</div>
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

export const AssetCardAction = <K extends keyof JSX.IntrinsicElements = 'button'>({
  use,
  children,
  ...p
}: { use?: K } & JSX.IntrinsicElements[K]): JSX.Element => {
  const Element = (use ?? 'button') as 'button'
  return (
    <Element
      {...(p as any)}
      className={cn(
        'hover text-active text-front/30 hover:text-active flex h-5 w-5 flex-shrink-0 items-center justify-center',
        p.className,
      )}
    >
      {children}
    </Element>
  )
}
