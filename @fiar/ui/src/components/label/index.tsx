import { cn } from 'mcn'

export const Label = ({
  position,
  className,
  ...props
}: { position: 'tl' | 'tr' | 'bl' | 'br' } & JSX.IntrinsicElements['label']) => (
  <label
    className={cn(
      'absolute rounded-full bg-white px-1 text-sm',
      cn({
        '-top-2 left-1': position === 'tl',
        '-top-2 right-3': position === 'tr',
        '-bottom-2 left-1': position === 'bl',
        '-bottom-2 right-3': position === 'br',
      }),
      className,
    )}
    {...props}
  />
)
