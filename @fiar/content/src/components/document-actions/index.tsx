import { component, useComponents } from '@fiar/workbench'
import { Menu } from '@fiar/ui'
import React from 'react'

export const ContentDocumentActions = component(
  'content:document:actions',
  (p: { children: JSX.Element | JSX.Element[]; exclude?: string[] }) => {
    const components = useComponents()
    const exclude = p.exclude || []
    const existing = React.Children.map(p.children, (x) => x?.type.component)
    const rest = Object.keys(components).filter(
      (x) => /content:document:actions:/.test(x) && !existing.includes(x) && !exclude.includes(x),
    )
    return (
      <Menu size="md">
        {p.children}
        {rest.map((key) => {
          const Comp = components[key] as any
          return <Comp key={key} />
        })}
      </Menu>
    )
  },
)
