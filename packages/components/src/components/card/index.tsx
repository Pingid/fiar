import { cn } from 'mcn'
import { extend } from '../../util/forwardRef.js'

export const Card = extend<'button', { icon?: React.ReactNode; head?: React.ReactNode }>(
  ({ elementType, icon, head, children, className, ...props }, ref) => {
    const Wrapper: any = elementType || 'div'
    return (
      <Wrapper {...props} ref={ref} className={cn('frame hover:border-active group/card w-full border p-2', className)}>
        <p className="flex items-start gap-2 py-0.5 text-lg leading-none">
          {icon && (
            <span className="relative bottom-[1px] block h-[1.15rem] w-[1.15rem] [&>svg]:h-full [&>svg]:w-full">
              {icon}
            </span>
          )}
          {head}
        </p>
        {children}
      </Wrapper>
    )
  },
)
