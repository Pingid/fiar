import { ComponentProps, ElementType } from 'react'
import { cn } from 'mcn'

export const Card = <E extends ElementType = 'button'>({
  elementType,
  icon,
  title,
  children,
  className,
  ...props
}: {
  elementType?: E
  icon?: React.ReactNode
  title?: React.ReactNode
  children?: React.ReactNode
} & Omit<ComponentProps<E>, 'children' | 'elementType' | 'icon' | 'title'>) => {
  const Wrapper = elementType || 'div'
  return (
    <Wrapper {...props} className={cn('frame hover:border-active group/card w-full border p-2', className)}>
      <p className="flex items-start gap-2 py-0.5 text-lg leading-none">
        {icon && (
          <span className="relative bottom-[1px] block h-[1.15rem] w-[1.15rem] [&>svg]:h-full [&>svg]:w-full">
            {icon}
          </span>
        )}
        {title}
      </p>
      {children}
    </Wrapper>
  )
}
