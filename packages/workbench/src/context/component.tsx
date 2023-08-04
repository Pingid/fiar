import React from 'react'

import { useFiarAppState } from './fiar'

export const useComponents = () => useFiarAppState((x) => x.components) as Record<string, any>

export const component = <N extends string, P extends Record<string, any>>(
  label: N,
  Component: (props: P) => React.ReactNode,
): ((props: P) => JSX.Element) & { label: N; Component: (props: P) => JSX.Element } =>
  Object.assign(swapper({ label, Component }), { label, Component }) as any

const swapper = (swap: { label: string; Component: (props: any) => React.ReactNode }) => (props: any) => {
  const Component = useFiarAppState((x) => (x.components as any)?.[swap.label])
  if (Component) return <Component {...props} />
  return <swap.Component {...props} />
}

export const RenderComponent = ({ name, ...props }: { name: string; [x: string]: any }): JSX.Element | null => {
  const Component = useComponents()[name]
  if (!Component) return <>Missing {name}</>
  return <Component {...props} />
}

export const ComponentList = (p: { children: (name: string[]) => string[] }): JSX.Element => {
  const components = useComponents()
  return (
    <>
      {p.children(Object.keys(components)).map((name) => {
        const Comp = components[name] as any
        return <Comp key={name}></Comp>
      })}
    </>
  )
}
