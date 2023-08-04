import cn from 'mcn'

const sizes = {
  xs: 'h-4 w-4 text-[6px] text-[50%]',
  sm: 'h-7 w-7 text-[50%]',
  md: 'h-8 w-8 sm:h-9 sm:w-9 text-[60%]',
}

export const Avatar = (p: {
  displayName?: string | undefined
  photoURL?: string | null | undefined
  size?: keyof typeof sizes
  className?: string
}) => {
  if (!p.displayName) return null
  return (
    <div className={cn('inline-block shrink-0 [&>*]:h-full [&>*]:w-full', sizes[p.size || 'md'], p.className)}>
      {p.photoURL ? (
        <img src={p.photoURL} className="rounded-full" />
      ) : (
        <div
          className="bg-front text-back flex items-center justify-center rounded-full"
          style={{ backgroundColor: `hsl(${Math.abs(hash(p.displayName))}, 29%, 44%)` }}
        >
          <span>{p.displayName.split(' ').map((x) => x[0])}</span>
        </div>
      )}
    </div>
  )
}

const hash = (s: string) =>
  s.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
