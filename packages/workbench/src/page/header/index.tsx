import { Link } from 'wouter'
import { cn } from 'mcn'

import { PageStatusBar } from '../status/index.js'

export const Header = (props: {
  subtitle?: string
  children?: React.ReactNode
  breadcrumbs?: { children: React.ReactNode; href: string }[]
}) => {
  return (
    <>
      <div className="relative z-20 space-y-2 p-3 pb-6">
        <Breadcrumbs>{props.breadcrumbs?.map((p, i) => <Breadcrumb key={i} {...p} />)}</Breadcrumbs>
        {props.subtitle && <p className="text-front/60 text-xs leading-none">{props.subtitle}</p>}
        <PageStatusBar />
      </div>
      {props.children ? (
        <div className="bg-back sticky top-[calc(var(--asside-height)-1px)] z-20 flex justify-between border-b border-t px-3 py-2">
          {props.children}
        </div>
      ) : (
        <div className="w-full border-t" />
      )}
    </>
  )
}

const Breadcrumbs = (props: { children: React.ReactNode }) => {
  const nav = cn(
    '[&>*]:text-front/50 [&>*:hover]:text-front [&>*:last-child]:text-front [&>*:last-child]:after:hidden [&>*:first-child]:ml-0 [&>*:first-child]:pl-0',
  )
  return <nav className={cn('relative whitespace-break-spaces text-3xl', nav)}>{props.children}</nav>
}

const Breadcrumb = (props: { children: React.ReactNode; href?: string }) => {
  const divider = cn(
    `after:absolute after:ml-2.5 after:mr-1.5 after:![content:'/'] after:hover:text-front after:text-front/50 after:text-2xl after:mt-[2px]`,
  )
  return (
    <Link href={props.href}>
      <a className={cn('ml-6 inline whitespace-pre-wrap pl-1 [overflow-wrap:anywhere]', divider)}>{props.children}</a>
    </Link>
  )
}
