import { cn } from 'mcn'
import { forward } from '../../util/forwardRef.js'

export const Select = forward<'select'>((props, ref) => {
  return (
    <select
      {...props}
      ref={ref}
      className={cn(
        'h-full w-full bg-transparent px-1 py-1 focus:outline-none focus-visible:outline-none',
        props.className,
      )}
    />
  )
})
