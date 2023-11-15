import { cn } from 'mcn'

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

export type CardProps = {
  title?: React.ReactNode
  children?: React.ReactNode
  asside?: React.ReactNode
  icon?: React.ReactNode
  image?: React.ReactNode
}

export const Card: {
  <K extends keyof JSX.IntrinsicElements = 'button'>(p: { use?: K } & CardProps & JSX.IntrinsicElements[K]): JSX.Element
  <P extends any, U extends (props: P) => React.ReactNode>(p: { use?: U } & CardProps & P): JSX.Element
  Title: (p: { children: React.ReactNode }) => JSX.Element
} = ({ children }: CardProps) => {
  return (
    <div className="bg-front-lt relative flex gap-2 rounded-sm border px-2 py-1">
      {/* {image && <div className="grid aspect-square h-10">{image}</div>}
      <div>
        <div>{title && <h3 className="">{title}</h3>}</div>
      </div> */}
      {children}
      {/* <div className="bg-back absolute -right-[.4rem] -top-[.4rem] h-[.9rem] w-[.9rem] rotate-45" /> */}
    </div>
  )
}

Card.Title = (p: { children: React.ReactNode }) => <h3 className="flex gap-1.5">{p.children}</h3>
