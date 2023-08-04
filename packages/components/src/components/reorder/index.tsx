import { useDrag, useDrop, useDragLayer } from 'react-dnd'
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { DndProvider } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { cn } from 'mcn'

import { useUpdatedRef } from '../../hooks'

export const Reorder = ({ children, className, ...props }: JSX.IntrinsicElements['ul']) => (
  <DndProvider options={HTML5toTouch}>
    <ul className={cn('', className)} {...props}>
      {children}
    </ul>
  </DndProvider>
)

Reorder.Item = ({
  children,
  className,
  index,
  label,
  menue,
  collapsed,
  onDrop,
  onRemove,
  onReorder,
  ...props
}: JSX.IntrinsicElements['li'] & {
  label?: string
  collapsed?: boolean
  menue?: React.ReactNode
  index: number
  onRemove?: () => void
  onReorder: (from: number, to: number) => void
}) => {
  const ref = useUpdatedRef({ onReorder, index })
  const [_, drag] = useDrag(
    () => ({ type: 'item', item: { index }, collect: (monitor) => ({ currentDragging: monitor.isDragging() }) }),
    [index],
  )

  return (
    <>
      <li className={cn('relative flex gap-2', className)} {...props} ref={drag}>
        <div className="w-full">{children}</div>
        <div className="bg-front/5 flex flex-col items-center justify-between rounded-r-md py-1">
          <button className="bg-bg" onClick={onRemove}>
            <XMarkIcon className="relative h-4 w-4" />
          </button>
          <div className="relative -left-2 flex cursor-move">
            <div className="h-5 w-[5px]">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </div>
            <div className="h-5 w-[5px]">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </li>
      <Target onReorder={(from) => ref.current.onReorder(from, ref.current.index)} disabled={false} />
    </>
  )
}

const Target = ({ onReorder, disabled }: { onReorder: (from: number) => void; disabled: boolean }) => {
  const ref = useUpdatedRef({ onReorder })
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'item',
      drop: (x: { index: number }) => ref.current.onReorder(x.index),
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [],
  )
  const dragging = useDragLayer((x) => x.isDragging())
  return (
    <li
      ref={drop}
      className={cn('relative transition-[height] delay-75', [!disabled && dragging, 'h-5', 'h-0'], {
        'bg-active/5': !isOver && dragging,
        'bg-active/40': isOver,
      })}
    ></li>
  )
}
