import React from 'react'
import { cn } from 'mcn'

import { LoadingDots } from '../loading/index.js'

export const Header = (p: { children: React.ReactNode }): JSX.Element => (
  <div className="bg-back sticky top-0 z-30">{p.children}</div>
)

Header.BreadCrumb = (p: { children: React.ReactNode }): JSX.Element => (
  <nav className="bg-back flex flex-wrap items-center px-3 pt-5 text-sm">
    {React.Children.map(p.children, (x, i) => (
      <React.Fragment key={i}>
        {x}
        {i < React.Children.count(p.children) - 1 && x && <span className="pl-2 pr-1.5">/</span>}
      </React.Fragment>
    ))}
  </nav>
)

Header.Content = (p: { children: React.ReactNode; loading?: boolean; error?: React.ReactNode }) => (
  <div className="border-b px-2 pt-[--header-pt]">
    <div className="flex items-end justify-between gap-1 pb-1">
      <div>
        <p className={cn('transition-width overflow-hidden whitespace-nowrap', [p.loading, 'w-7', 'w-0'])}>
          <span className="ml-2"> </span>
          <LoadingDots />
        </p>
        <p className="text-error text-sm leading-snug">{p.error}</p>
      </div>
      {p.children}
    </div>
  </div>
)
