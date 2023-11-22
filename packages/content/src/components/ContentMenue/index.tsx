import { createGlobalSlot } from '@fiar/components'
import { Link, useRoute } from 'wouter'
import { cn } from 'mcn'

import { PageBreadcrumbSlot } from '@fiar/workbench/page/breadcrumb'

const ContentLinkSlot = createGlobalSlot()

export const ContentMenu = (props: { children: React.ReactNode }) => {
  return (
    <ContentLinkSlot.Provider>
      <PageBreadcrumbSlot.Provider>
        <div className="flex h-full w-full flex-col">
          <nav className="p-3 text-sm [&>*:last-child_*]:after:hidden">
            <PageBreadcrumbSlot.Locate use="span" />
          </nav>
          {props.children}
        </div>
      </PageBreadcrumbSlot.Provider>
    </ContentLinkSlot.Provider>
  )
}

export const ContentLink = (props: {
  children: React.ReactNode
  href: string
  active?: boolean
  icon?: React.ReactNode
}) => {
  const [match] = useRoute(props.href)
  const [child] = useRoute(`${props.href}/*`)
  const active = match || child

  return (
    <ContentLinkSlot.Place>
      <Link href={props.href}>
        <a className={cn([active, 'text-front', 'text-front/70'])}>
          {props.icon && (
            <span className="mr-2 mt-[2px] inline-block h-4 w-4 [&>*]:h-full [&>*]:w-full">{props.icon}</span>
          )}
          {props.children}
        </a>
      </Link>
    </ContentLinkSlot.Place>
  )
}
