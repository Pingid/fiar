import cn from 'mcn'

const variants = {
  filled: 'bg-front/5',
  border: 'border-b',
  empty: '',
}

type SharedProps = {
  title?: React.ReactNode
  children?: React.ReactNode
  asside?: React.ReactNode
  icon?: React.ReactNode
  variant?: (keyof typeof variants)[]
}

export const InfoCard: {
  <K extends keyof JSX.IntrinsicElements = 'button'>(
    p: { use?: K } & SharedProps & JSX.IntrinsicElements[K],
  ): JSX.Element
  <P extends any, U extends (props: P) => React.ReactNode>(p: { use?: U } & SharedProps & P): JSX.Element
} = ({
  use = 'button',
  title,
  children,
  variant,
  icon,
  asside,
  ...props
}: SharedProps & { use: string; variant?: (keyof typeof variants)[] }) => {
  const Element = use as any
  return (
    <Element
      {...props}
      className={cn(
        'group w-full text-left sm:space-y-1',
        ...(variant || []).map((x) => variants[x]),
        [!!(props as any).onClick, 'hover:border-active hover:text-active'],
        (props as any)?.className,
      )}
    >
      <div className="grid gap-1 [grid-template-columns:min-content_1fr_max-content]">
        <div className="pt-1">{icon}</div>
        <h1 className="flex-start flex gap-2">{title}</h1>
        <div>{asside}</div>
      </div>
      <div className="grid gap-1 [grid-template-columns:1fr_max-content]">{children}</div>
    </Element>
  )
}
