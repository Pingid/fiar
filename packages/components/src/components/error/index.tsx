import { cn } from 'mcn'

export const ErrorMessage = (p: JSX.IntrinsicElements['p']) => (
  <p {...p} className={cn(p.className, 'text-error w-full truncate whitespace-break-spaces')}>
    {error(p.children)}
  </p>
)

const error = (x: unknown) => {
  if (typeof x === 'string') return x
  if (x instanceof Error) return x.message
  if (!x) return null
  return JSON.stringify(x)
}
