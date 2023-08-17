import { Button, LoadingDots } from '@fiar/components'
import { Link } from 'react-router-dom'
import { Fragment } from 'react'
import cn from 'mcn'

export const Page = (p: {
  children: React.ReactNode
  error?: string
  loading?: boolean
  breadcrumb?: { title: string; to?: string; disabled?: boolean; onClick?: () => void; icon?: React.ReactNode }[]
  actions?: React.ReactNode
}) => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="bg-back sticky top-0 z-30">
        <nav className="bg-back flex flex-wrap items-center px-3 pt-5 text-sm">
          {(p.breadcrumb || []).map((crumb, i) => (
            <Fragment key={crumb.title}>
              <Button
                variant="link"
                size="sm"
                to={crumb.to}
                icon={crumb.icon}
                use={(crumb.to ? Link : 'button') as any}
                onClick={crumb.onClick}
                disabled={!!crumb.disabled}
                className="max-w-[80%] truncate whitespace-nowrap text-left"
              >
                {crumb.title}
              </Button>
              {i < (p.breadcrumb || []).length - 1 && <span className="pl-2 pr-1.5">/</span>}
            </Fragment>
          ))}
        </nav>
        <div className="border-b px-2 pt-[--header-pt]">
          <div className="flex items-end justify-between gap-1 pb-1">
            <div>
              <p className={cn('transition-width overflow-hidden whitespace-nowrap', [p.loading, 'w-7', 'w-0'])}>
                <span className="ml-2"> </span>
                <LoadingDots />
              </p>
              <p className="text-error text-sm leading-snug">{p.error}</p>
            </div>
            {p.actions}
          </div>
        </div>
      </div>
      <div className="h-full w-full">{p.children}</div>
    </div>
  )
}
