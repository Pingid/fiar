import React from 'react'

export const Header = (p: { children: React.ReactNode }): JSX.Element => {
  return <div className="bg-back sticky top-0 z-30">{p.children}</div>
}

Header.Nav = (p: { children: React.ReactNode }): JSX.Element => (
  <nav className="bg-back flex flex-wrap items-center gap-2 px-2 pt-6 text-sm">
    {React.Children.map(p.children, (x, i) => (
      <React.Fragment key={i}>
        {x}
        {i < React.Children.count(p.children) - 1 && x && <span>/</span>}
      </React.Fragment>
    ))}
  </nav>
)
