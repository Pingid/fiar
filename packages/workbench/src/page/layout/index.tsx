import { createGlobalSlot } from '@fiar/components'

import { PageBreadcrumb } from '../breadcrumb/index.js'
import { PageStatusProvider } from '../status/index.js'

const ActionSlot = createGlobalSlot()
const HeadSlot = createGlobalSlot()

export const Page = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageStatusProvider>
      {/* <PageBreadcrumbSlot.Provider> */}
      <ActionSlot.Provider>
        <HeadSlot.Provider>
          {/* <div className="bg-back sticky top-12 z-20 w-full border-b sm:top-0">
            <div className={cn('flex flex-wrap justify-between gap-3 px-4 pb-3 pt-4')}>
              <nav className="text-sm [&>*:last-child_*]:after:hidden">
                  <PageBreadcrumbSlot.Locate use="span" />
                </nav>
              <div className="" />
              <div className="flex w-max justify-end gap-2">
                <ActionSlot.Locate use="div" />
              </div>
            </div>
            <PageStatusBar />
            <HeadSlot.Locate use="div" className="w-full" />
          </div> */}
          {children}
        </HeadSlot.Provider>
      </ActionSlot.Provider>
      {/* </PageBreadcrumbSlot.Provider> */}
    </PageStatusProvider>
  )
}

Page.Head = HeadSlot.Place
Page.Action = ActionSlot.Place
Page.Breadcrumb = PageBreadcrumb
