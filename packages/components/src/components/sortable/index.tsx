import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'

export { SortableItem } from './item/index.js'

export const Sortable = <T extends { id: number | string }>(props: {
  onSort: (from: number, to: number) => void
  items: T[]
  children: JSX.Element[]
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over?.id) return
    if (active.id !== over.id) {
      const oldIndex = props.items.findIndex((x) => x.id === active.id)
      const newIndex = props.items.findIndex((x) => x.id === over.id)
      return props.onSort(oldIndex, newIndex)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={props.items} strategy={verticalListSortingStrategy}>
        {props.children}
      </SortableContext>
    </DndContext>
  )
}
