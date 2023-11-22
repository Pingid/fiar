import { Fragment, cloneElement } from 'react'
import { create } from 'zustand'

export type ContentItem = { key: string; label: string; children: React.ReactNode }

export const useContentItemList = create<{
  items: ContentItem[]
  registerItem: (content: ContentItem) => () => void
}>((set) => ({
  items: [],
  registerItem: (content: ContentItem) => {
    set((x) => ({
      items: [...x.items, content].reduce(
        (a, b) => (a.some((y) => y.key === b.key) ? a : [...a, b]),
        [] as ContentItem[],
      ),
    }))
    return () => set((x) => ({ items: x.items.filter((x) => x !== content) }))
  },
}))

export const ContentPage = () => {
  const content = useContentItemList((x) => x.items)
  const grouped: Record<string, React.ReactNode[]> = {}
  content.forEach((x) => {
    if (!grouped[x.label]) grouped[x.label] = []
    grouped[x.label]!.push(cloneElement(x.children as any, { key: x.key }))
  })

  return (
    <>
      <div className="mt-3 space-y-3 px-2">
        {Object.keys(grouped).map((label) => (
          <Fragment key={label}>
            <h4 className="text-front/50 text-sm font-semibold uppercase">{label}</h4>
            <ul className="w-full space-y-3">{grouped[label]}</ul>
          </Fragment>
        ))}
      </div>
    </>
  )
}
