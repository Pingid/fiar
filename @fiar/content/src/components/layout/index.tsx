import { component } from '@fiar/workbench'
import { ModalProvider } from '@fiar/ui'
import React from 'react'
// import { Toaster } from 'react-hot-toast'

export const ContentLayout = component('content:layout', (p: { children: React.ReactNode }) => {
  return (
    <ModalProvider className="fixed left-0 top-0 z-50">
      <div className="relative flex w-full flex-col [--header-pt:14px]">
        {/* <Toaster toastOptions={{ success: {}, error: {} }} /> */}
        {p.children}
      </div>
    </ModalProvider>
  )
})
