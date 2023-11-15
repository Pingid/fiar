import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { cn } from 'mcn'

import { Button, createGlobalSlot } from '@fiar/components'

import { PageStatusBar, PageStatusProvider } from './status/index.js'
import { PageBreadcrumb, PageBreadcrumbSlot } from './breadcrumb/index.js'

export { usePageStatusAsyncHandler, useSetPageStatus, usePageStatus } from './status/index.js'

const ActionSlot = createGlobalSlot()
const HeadSlot = createGlobalSlot()

export const Page = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageStatusProvider>
      <PageBreadcrumbSlot.Provider>
        <ActionSlot.Provider>
          <HeadSlot.Provider>
            <div className="bg-back sticky top-0 z-20 w-full border-b">
              <div className={cn('flex justify-between px-4 pt-4')}>
                <nav className="text-sm [&>*:last-child_*]:after:hidden">
                  <PageBreadcrumbSlot.Locate use="span" />
                </nav>
                <div className="group relative h-fit sm:max-w-[60%]" tabIndex={0}>
                  <button className="border-front/30 text-front focus:border-active rounded-sm border py-0.5 sm:hidden">
                    <EllipsisVerticalIcon className="h-6 w-5" />
                  </button>
                  <div className="bg-back absolute right-0 top-full z-30 mt-1 hidden h-fit min-w-[10rem] flex-col justify-end gap-2 rounded-sm border py-2 text-sm shadow-lg group-focus-within:flex sm:static sm:m-0 sm:flex sm:w-auto sm:flex-row sm:flex-wrap sm:border-none sm:p-0 sm:shadow-none [&>div>button]:w-full sm:[&>div>button]:w-auto">
                    <ActionSlot.Locate use="div" />
                  </div>
                </div>
              </div>
              <PageStatusBar />
              <HeadSlot.Locate use="div" className="w-full" />
            </div>
            {children}
          </HeadSlot.Provider>
        </ActionSlot.Provider>
      </PageBreadcrumbSlot.Provider>
    </PageStatusProvider>
  )
}

Page.ActionButton = ActionSlot.placer(Button)
Page.Action = ActionSlot.Place
Page.Head = HeadSlot.Place

Page.Breadcrumb = PageBreadcrumb
