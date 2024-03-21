import { EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export const SortableItem = (props: {
  id: number
  label?: React.ReactNode
  children: React.ReactNode
  onRemove?: () => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="bg-back rounded border">
      <div {...listeners} className="bg-frame flex justify-between border-b p-1">
        <div className="flex items-center gap-1">
          <button type="button" className="relative h-5 w-5 cursor-move">
            <EllipsisVerticalIcon className="absolute left-[-3px] top-0 h-full w-full" />
            <EllipsisVerticalIcon className="absolute left-[3px] top-0 h-full w-full" />
          </button>
          <p className="text-xs">{props.label}</p>
        </div>

        {props.onRemove && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => props.onRemove && props.onRemove()}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="p-2">{props.children}</div>
    </div>
  )
}
