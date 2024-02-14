import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { cn } from 'mcn'

export const Pagination = (props: { pages: number; end: boolean; onPage: (page: number) => void }) => {
  return (
    <div className="flex justify-between px-3 py-0.5 text-sm">
      <div></div>
      <div className="flex gap-3">
        <button
          disabled={props.pages === 0}
          className={cn('flex items-center gap-1', [props.pages === 0, 'opacity-20', 'hover:text-active'])}
          onClick={() => props.onPage(props.pages - 1)}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <div className="flex gap-1">
          {Array.from({ length: props.pages })
            .map((_, i) => i)
            .slice(-3)
            .map((x) => (
              <button
                key={x}
                className={cn('hover:text-active text-xs opacity-60 hover:opacity-100')}
                onClick={() => props.onPage(x)}
              >
                {x + 1}
              </button>
            ))}
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
    </div>
  )
}
