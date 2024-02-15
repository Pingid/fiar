import { forwardRef } from 'react'
import { useMedia } from 'react-use'

export const AssetGrid = forwardRef<HTMLDivElement, JSX.IntrinsicElements['div']>((props, ref) => {
  const columns = useMedia('(min-width: 500px)') ? 40 : 20

  return (
    <div
      {...props}
      ref={ref}
      className="grid w-full gap-4 px-3 pb-24 pt-3"
      style={{ gridTemplateColumns: `repeat(${Math.floor(columns / 20) + 1}, minmax(0, 1fr))` }}
    >
      {props.children}
    </div>
  )
})
