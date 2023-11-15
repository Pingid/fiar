import { Page } from '@fiar/workbench/v2'
import { Fragment, cloneElement } from 'react'
import { create } from 'zustand'

import { CircleStackIcon } from '@heroicons/react/24/outline'

type Content = { key: string; label: string; children: React.ReactNode }

export const useContent = create<{ content: Content[]; register: (content: Content) => () => void }>((set) => ({
  content: [],
  register: (content: Content) => {
    set((x) => ({
      content: [...x.content, content].reduce(
        (a, b) => (a.some((y) => y.key === b.key) ? a : [...a, b]),
        [] as Content[],
      ),
    }))
    return () => set((x) => ({ content: x.content.filter((x) => x !== content) }))
  },
}))

export const ContentList = () => {
  const content = useContent((x) => x.content)
  const grouped: Record<string, React.ReactNode[]> = {}
  content.forEach((x) => {
    if (!grouped[x.label]) grouped[x.label] = []
    grouped[x.label]!.push(cloneElement(x.children as any, { key: x.key }))
  })

  return (
    <Page>
      <Page.Breadcrumb title="Content" href="" icon={<CircleStackIcon />} />
      <div className="mt-3 space-y-3 px-2">
        {Object.keys(grouped).map((label) => (
          <Fragment key={label}>
            <h4 className="text-front/50 text-sm font-semibold uppercase">{label}</h4>
            <ul className="w-full space-y-3">{grouped[label]}</ul>
          </Fragment>
        ))}
      </div>
    </Page>
  )
}
