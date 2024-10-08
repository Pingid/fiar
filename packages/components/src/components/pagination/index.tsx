import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { cn } from 'mcn'

export const Pagination = (props: { pages: number; end: boolean; onPage: (page: number) => void }) => {
  const size = 3
  const button = (x: number) => (
    <button
      key={x}
      className={cn('hover:text-active text-xs opacity-60 hover:opacity-100')}
      onClick={() => props.onPage(x)}
    >
      {x + 1}
    </button>
  )

  return (
    <div className="flex gap-2 text-sm">
      <button
        disabled={props.pages === 0}
        className={cn('flex items-center gap-1', [props.pages === 0, 'opacity-20', 'hover:text-active'])}
        onClick={() => props.onPage(props.pages - 1)}
      >
        <ArrowLeftIcon className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-1 leading-none">
        {props.pages >= size && button(0)}
        {props.pages > size && <span className="px-0.5">..</span>}
        {Array.from({ length: props.pages })
          .map((_, i) => i)
          .slice(-(size - 1))
          .map((x) => button(x))}
        <button>{props.pages + 1}</button>
      </div>
      <button
        disabled={props.end}
        className={cn('flex items-center gap-1', [props.end, 'opacity-20', 'hover:text-active '])}
        onClick={() => props.onPage(props.pages + 1)}
      >
        <ArrowLeftIcon className="h-4 w-4 rotate-180" />
      </button>
    </div>
  )
}
