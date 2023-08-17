import { getDownloadURL, ref } from '@firebase/storage'
import { WorkbenchPageModal } from '@fiar/workbench'
import useMutation from 'swr/mutation'
import { Editor } from '@tiptap/react'
import React from 'react'

import { SelectAssetProvider } from '../../context/select'
import { useAssetConfig } from '../../context/config'
import { is_image } from '../../context/assets'
import { PhotoIcon } from '../icons'

export const TipTapControl = (p: { editor: Editor }): JSX.Element => {
  const config = useAssetConfig()
  const [open, setopen] = React.useState(false)
  const url = useMutation({}, (_, a: { arg: string }) =>
    getDownloadURL(ref(config.storage, a.arg)).then((url) => p.editor.chain().focus().setImage({ src: url }).run()),
  )
  return (
    <button
      onClick={() => setopen(true)}
      disabled={url.isMutating}
      className="hover:bg-front/5 px-2 disabled:animate-pulse"
    >
      <PhotoIcon className="h-4 w-4" />
      <SelectAssetProvider
        value={{
          filter: (x) => is_image.test(x),
          select: ({ fullPath }) => {
            url.trigger(fullPath)
            setopen(false)
          },
        }}
      >
        <WorkbenchPageModal open={open} close={() => setopen(false)} path="/assets" />
      </SelectAssetProvider>
    </button>
  )
}
