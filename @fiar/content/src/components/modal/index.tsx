import { Modal } from '@fiar/ui'
import React from 'react'

import { XIcon } from '../icons'

export const ContentModal = (p: { open: boolean; close: () => void; children: React.ReactNode }): JSX.Element => {
  return (
    <Modal closed={!p.open}>
      <div
        className="fixed flex h-full w-full bg-black/60 pt-24 sm:items-center sm:justify-center sm:p-12"
        onClick={() => p.close()}
      >
        <div
          className="bg-back relative flex max-h-full min-h-[70vh] w-full max-w-3xl flex-col overflow-y-auto rounded-md border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="z-40 flex w-full justify-end">
            <button className="pr-2 pt-2" onClick={() => p.close()}>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="relative overflow-y-auto">{p.children}</div>
        </div>
      </div>
    </Modal>
  )
}
