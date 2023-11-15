import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import React, { Fragment } from 'react'
import { Link } from 'wouter'
import { cn } from 'mcn'

import { Button, getSlots } from '@fiar/components'

export const Header = (p: { children?: React.ReactNode }) => {
  const slot = getSlots(p.children, { crumbs: ['Header.Breadcrumb'], actions: ['Header.Action'] })

  return (
    <div className="bg-back sticky top-0 z-20 w-full border-b">
      <div className={cn('flex justify-between', [slot.crumbs.length > 0, 'px-4 pt-4'])}>
        <BreadCrumbs>{slot.crumbs}</BreadCrumbs>
        <div className="group relative h-fit sm:max-w-[60%]" tabIndex={0}>
          <button className="bg-active/5 text-front focus:border-active rounded-md border py-0.5 sm:hidden">
            <EllipsisVerticalIcon className="h-6 w-5" />
          </button>
          <div className="bg-back absolute right-0 top-full mt-1 hidden h-fit min-w-[10rem] flex-col justify-end gap-2 rounded-md border py-2 text-sm shadow-lg group-focus-within:flex sm:static sm:m-0 sm:flex sm:w-auto sm:flex-row sm:flex-wrap sm:border-none sm:p-0 sm:shadow-none">
            {slot.actions}
          </div>
        </div>
      </div>
      {slot.children}
    </div>
  )
}

const BreadCrumbs = (props: { children: React.ReactNode }) => (
  <nav className="text-sm [&>*:last-child]:after:hidden">{props.children}</nav>
)

Header.Action = Object.assign((props: { children: React.ReactNode }) => props.children, { slot: 'Header.Action' })
Header.ActionButton = Object.assign(Button, { slot: 'Header.Action' })
// ActionButton.slot = 'Action'

export const Breadcrumb = (props: { icon?: React.ReactNode; title?: string; href?: string }) => {
  const active = typeof props.href === 'string'
  const Element: any = active ? Link : Fragment
  const divider = cn(`after:absolute after:ml-2 after:mr-1.5 after:![content:'/'] after:hover:text-front`)
  return (
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
  )
}

Header.Breadcrumb = Object.assign(Breadcrumb, { slot: 'Header.Breadcrumb' })
