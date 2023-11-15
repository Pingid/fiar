import { Fragment } from 'react'
import { Link } from 'wouter'
import { cn } from 'mcn'

import { createGlobalSlot } from '@fiar/components'

export const PageBreadcrumbSlot = createGlobalSlot()

export const PageBreadcrumb = (props: { icon?: React.ReactNode; title?: string; href?: string }) => {
  const active = typeof props.href === 'string'
  const Element: any = active ? Link : Fragment
  const divider = cn(`after:absolute after:ml-2 after:mr-1.5 after:![content:'/'] after:hover:text-front`)
  return (
    <PageBreadcrumbSlot.Place>
      <Element key={props.href || props.title} {...(active ? { href: props.href } : {})}>
        <a
          className={cn('mr-5 inline border-b border-transparent pb-0.5', divider, [
            active,
            'hover:text-active hover:border-active',
          ])}
          role={active ? 'button' : undefined}
        >
          <span className="relative bottom-[2px] mr-1 [&>*]:inline [&>*]:w-4">{props.icon}</span>
          {props.title}
        </a>
      </Element>
    </PageBreadcrumbSlot.Place>
  )
}
