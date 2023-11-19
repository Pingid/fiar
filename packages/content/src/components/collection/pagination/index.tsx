import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { cn } from 'mcn'

export const CollectionPagination = (props: {
  pages: any[]
  goTo: (n: number) => void
  end?: boolean
}): JSX.Element => {
  return (
    <div className="flex w-full justify-between border-t px-3 py-0.5 text-sm">
      <button
        disabled={props.pages.length === 0}
        className={cn('flex items-center gap-1', [props.pages.length === 0, 'opacity-20', 'hover:text-active'])}
        onClick={() => props.goTo(props.pages.length - 1)}
      >
        <ArrowLeftIcon className="h-4 w-4" /> previous
      </button>
      {/* <div className="flex gap-1">{props.page + 1}</div> */}
      <div className="flex gap-1">
        {props.pages
          .map((_, i) => i)
          .slice(-3)
          .map((x) => (
            <button
              key={x}
              className={cn('hover:text-active text-xs opacity-60 hover:opacity-100')}
              onClick={() => props.goTo(x)}
            >
              {x + 1}
            </button>
          ))}
        <button>{props.pages.length + 1}</button>
      </div>
      <button
        disabled={!!props.end}
        className={cn('flex items-center gap-1', [props.end, 'opacity-20', 'hover:text-active '])}
        onClick={() => props.goTo(props.pages.length + 1)}
      >
        next <ArrowLeftIcon className="h-4 w-4 rotate-180" />
      </button>
    </div>
  )
}
