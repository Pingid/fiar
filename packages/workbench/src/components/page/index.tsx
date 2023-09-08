import { Button, LoadingDots } from '@fiar/components'
import { Fragment } from 'react'
import { Link } from 'wouter'
import cn from 'mcn'

export type PageBreadCrumb = {
  title: string
  to?: string
  disabled?: boolean
  onClick?: () => void
  icon?: React.ReactNode
}
export const Page = (p: {
  children: React.ReactNode
  error?: string
  loading?: boolean
  breadcrumb?: PageBreadCrumb[]
  actions?: React.ReactNode
}) => {
  const breadcrumbs: PageBreadCrumb[] = [...(p.breadcrumb || [])]
  return (
    <div className="grid min-h-full w-full [grid-template-rows:min-content_1fr]">
      <div className="bg-back sticky top-0 z-30 grid w-full [grid-template-rows:min-content_min-content]">
        <nav className="bg-back flex flex-wrap items-center px-[calc(var(--wb-page-px)+3px)] pb-[--wb-nav-pb] pt-[--wb-nav-pt] text-sm">
          {breadcrumbs.map((crumb, i) => (
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
              {i < breadcrumbs.length - 1 && <span className="pl-2 pr-1.5">/</span>}
            </Fragment>
          ))}
        </nav>
        <div
          className={cn(
            'w-full max-w-full border-b px-[--wb-page-px] pt-[--wb-head-pt]',
            [!!p.actions, 'pb-1'],
            'grid items-end [grid-template-columns:min-content_1fr_max-content]',
          )}
        >
          <p className={cn('transition-width overflow-hidden whitespace-nowrap', [p.loading, 'w-7', 'w-0'])}>
            <span className="ml-2"> </span>
            <LoadingDots />
          </p>
          <p className="text-error max-w-full pr-2 text-sm leading-snug">{error(p.error)}</p>
          <div className="place-self-end">{p.actions}</div>
        </div>
      </div>
      <div className="h-[150vh] h-full w-full px-[--wb-page-px]">{p.children}</div>
    </div>
  )
}

const error = (x: unknown) => {
  if (typeof x === 'string') return x
  if (x instanceof Error) return x.message
  if (!x) return null
  return JSON.stringify(x)
}
