import { getDownloadURL, ref } from '@firebase/storage'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { Image } from '@tiptap/extension-image'
import useSWRMutation from 'swr/mutation'
import { Editor } from '@tiptap/react'
import { useEffect, useState } from 'react'

import { TipTapTool, useTipTapExtensions, TipTapToolButton } from '@fiar/content/components'
import { WorkbenchPageModal } from '@fiar/workbench'

import { SelectAssetProvider } from '../../hooks/select.js'
import { useConfig } from '../../hooks/config.js'
import { is_image } from '../../hooks/data.js'

export const TipTapImageTool = () => {
  useEffect(() => useTipTapExtensions.setState((x) => ({ extensions: [...x.extensions, Image as any] })), [])
  return <TipTapTool>{(props) => <TipTapImageToolControl {...props} />}</TipTapTool>
}

const TipTapImageToolControl = (p: { editor: Editor }): JSX.Element => {
  const storage = useConfig((x) => x.storage!)
  const [open, setOpen] = useState(false)
  const url = useSWRMutation({}, (_, a: { arg: string }) =>
    getDownloadURL(ref(storage, a.arg)).then((url) => p.editor.chain().focus().setImage({ src: url }).run()),
  )

  return (
    <TipTapToolButton onClick={() => setOpen(true)} disabled={url.isMutating}>
      <PhotoIcon className="h-4 w-4" />
      <SelectAssetProvider
        value={{
          filter: (x) => is_image.test(x),
          select: ({ fullPath }) => {
            url.trigger(fullPath)
            setOpen(false)
          },
        }}
      >
        <WorkbenchPageModal open={open} close={() => setOpen(false)} app="/assets" />
      </SelectAssetProvider>
    </TipTapToolButton>
  )
}
