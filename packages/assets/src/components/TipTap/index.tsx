import { getDownloadURL, ref } from '@firebase/storage'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { Image } from '@tiptap/extension-image'
import { useEffect, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { Editor } from '@tiptap/react'

import { TipTapTool, useTipTapExtensions, TipTapToolButton } from '@fiar/content/components'
import { WorkbenchPageModal } from '@fiar/workbench'

import { SelectAssetProvider } from '../../context/select.js'
import { useFirebaseStorage } from '../../context/config.js'

export const TipTapImageTool = () => {
  useEffect(
    () =>
      useTipTapExtensions.setState((x) => ({
        extensions: [...x.extensions, Image as any].filter((x) => x.name !== Image.name),
      })),
    [],
  )
  return <TipTapTool>{(props) => <TipTapImageToolControl {...props} />}</TipTapTool>
}

const TipTapImageToolControl = (p: { editor: Editor }): JSX.Element => {
  const storage = useFirebaseStorage()
  const [open, setOpen] = useState(false)
  const url = useSWRMutation({}, (_, a: { arg: string }) =>
    getDownloadURL(ref(storage, a.arg)).then((url) => {
      p.editor.chain().focus().setImage({ src: url }).run()
    }),
  )

  return (
    <TipTapToolButton onClick={() => setOpen(true)} disabled={url.isMutating}>
      <PhotoIcon className="h-4 w-4" />
      <SelectAssetProvider
        value={({ fullPath }) => {
          url.trigger(fullPath)
          setOpen(false)
        }}
      >
        <WorkbenchPageModal open={open} close={() => setOpen(false)} path="/assets" />
      </SelectAssetProvider>
    </TipTapToolButton>
  )
}
