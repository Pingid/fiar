import { Link } from '@fiar/workbench/router'

export const LinkCard = ({
  icon,
  children,
  label,
  subheader,
  href,
}: {
  label?: string
  href: string
  icon?: React.ReactNode
  subheader?: React.ReactNode
} & JSX.IntrinsicElements['a']) => {
  return (
    <Link to={href} asChild>
      <a className="hover:border-foreground/30 group flex items-center justify-between gap-2 border p-3">
        <div className="flex items-center gap-2">
          <span className="relative mx-0.5 block h-[1.9rem] w-[1.9rem] opacity-80 [&>svg]:h-full [&>svg]:w-full">
            {icon}
          </span>
          <div className="min-h-10">
            <p className="">{label}</p>
            <p className="text-tiny text-forground">{subheader}</p>
          </div>
        </div>
        {children}
      </a>
    </Link>
  )
}
