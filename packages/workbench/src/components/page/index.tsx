import { Fragment } from 'react'
import { Link } from 'wouter'
import { cn } from 'mcn'

import { ErrorMessage, LoadingDots, Menu } from '@fiar/components'

export type PageBreadCrumb = {
  title: string
  to?: string
  disabled?: boolean
  onClick?: () => void
  icon?: React.ReactNode
}

export type PageAction = {
  title: string
  onClick: () => void
  icon?: React.ReactNode
}

export const Page = (p: {
  children: React.ReactNode
  error?: string
  loading?: boolean
  breadcrumb?: PageBreadCrumb[]
  header?: React.ReactNode
  action?: React.ReactNode
}) => {
  const breadcrumbs: PageBreadCrumb[] = [...(p.breadcrumb || [])]
  return (
    <div className="grid min-h-full w-full [grid-template-rows:min-content_1fr]">
      <div className="bg-back sticky top-0 z-30 grid w-full border-b [grid-template-rows:min-content_min-content]">
        <div className="px-[calc(var(--wb-page-px)+3px)] pb-[--wb-nav-pb] pt-[--wb-nav-pt]">
          <div className="flex w-full items-start justify-between gap-1">
            <p className="w-full text-sm">
              {breadcrumbs.map((x, i) => {
                const Element = x.to ? Link : ('span' as 'a')
                const active = !!(x.to || x.onClick)
                return (
                  <Fragment key={x.title}>
                    <Element
                      href={x.to as string}
                      onClick={x.onClick}
                      className={cn('inline whitespace-nowrap border-b border-transparent pb-0.5', [
                        active,
                        'hover:text-active hover:border-active',
                      ])}
                      role={active ? 'button' : undefined}
                    >
                      <span className="relative bottom-[2px] mr-1 [&>*]:inline">{x.icon}</span>
                      <span className="inline whitespace-break-spaces">{x.title}</span>
                    </Element>
                    {i < breadcrumbs.length - 1 && <span className="ml-2 mr-1.5">/</span>}
                  </Fragment>
                )
              })}
            </p>
            <div className="hidden sm:flex">{p.action}</div>
            {p.action && (
              <Menu className="border-front border border p-1 sm:hidden" size="md">
                {p.action}
              </Menu>
            )}
          </div>
        </div>

        <div
          className={cn(
            'w-full max-w-full px-[--wb-page-px] pt-[--wb-head-pt]',
            'grid items-end [grid-template-columns:min-content_1fr_max-content]',
          )}
        >
          <p className={cn('transition-width overflow-hidden whitespace-nowrap', [p.loading, 'w-7', 'w-0'])}>
            <span className="ml-2"> </span>
            <LoadingDots />
          </p>
          <div className="text-error grid max-w-full pr-2 text-sm leading-snug">
            <ErrorMessage>{p.error}</ErrorMessage>
          </div>
        </div>
        {p.header}
      </div>
      <div className="h-full w-full px-[--wb-page-px]">{p.children}</div>
    </div>
  )
}
