import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon'
import cn from 'mcn'

export const Pagination = (p: {
  page: number
  next?: (() => void) | undefined
  prev?: (() => void) | undefined
}): JSX.Element => {
  const row = cn('flex items-center justify-center gap-1')
  return (
    <div className={row}>
      <button onClick={p.prev} disabled={!p.prev} className="disabled:opacity-10">
        <ChevronLeftIcon className="w-5" />
      </button>
      <div className="">{p.page}</div>
      <button onClick={p.next} disabled={!p.next} className="disabled:opacity-10">
        <ChevronLeftIcon className="w-5 rotate-180" />
      </button>
    </div>
  )
}
