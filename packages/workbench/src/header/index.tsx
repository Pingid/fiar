import { Link } from 'wouter'
import { cn } from 'mcn'

export const Header = (props: {
  subtitle?: string
  children?: React.ReactNode
  breadcrumbs?: { children: React.ReactNode; href?: string }[]
}) => {
  return (
    <>
      <div className={cn('relative z-20 space-y-2 p-3 pb-6', [!props.children, 'border-b'])}>
        <div className="grid [grid-template-columns:1fr_max-content]">
          <Breadcrumbs>{props.breadcrumbs?.map((p, i) => <Breadcrumb key={i} {...p} />)}</Breadcrumbs>
        </div>
        {props.subtitle && <p className="text-front/60 text-xs leading-none">{props.subtitle}</p>}
      </div>
      {props.children && (
        <div className="bg-back sticky top-[calc(var(--asside-height)-1px)] z-20 flex justify-between border-b border-t">
          {props.children}
        </div>
      )}
    </>
  )
}

const Breadcrumbs = (props: { children: React.ReactNode }) => {
  const nav = cn(
    '[&>*]:text-front/50 [&>*:hover]:text-front [&>*:last-child]:text-front',
    '[&>*:last-child]:after:hidden [&>*:first-child]:ml-0 [&>*:first-child]:pl-0',
  )
  return <nav className={cn('relative text-3xl', nav)}>{props.children}</nav>
}

const Breadcrumb = (props: { children: React.ReactNode; href?: string }) => {
  const divider = cn(
    `after:absolute after:ml-2.5 after:mr-1.5 after:![content:'/'] after:hover:text-front after:text-front/50 after:text-2xl after:mt-[2px]`,
  )
  if (!props.href) return <a className={cn('mr-6 inline pl-1', divider)}>{props.children}</a>
  return (
    <Link href={props.href as string} className={cn('mr-6 inline pl-1', divider)}>
      {props.children}
    </Link>
  )
}
