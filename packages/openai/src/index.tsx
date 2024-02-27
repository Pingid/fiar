// import { AuthConfig, useAuthConfig } from './context/index.js'
// import { Authorize } from './authorize/index.js'
import { ImageGenerateParams } from 'openai/resources/images.mjs'
import { PaintBrushIcon } from '@heroicons/react/24/outline'
import { useLayoutEffect, useState } from 'react'
import { uploadBytesResumable, ref } from '@firebase/storage'
import useSWRMutation from 'swr/mutation'
import { OpenAI } from 'openai'

import { Button, Field, FieldControl, Input, Select, TextArea } from '@fiar/components'
import { FolderAction, useFirebaseStorage, useUploads } from '@fiar/assets'
import { Header, WorkbenchModal } from '@fiar/workbench'
// import * as s from '@fiar/content/schema'

import { OpenAiConfig, useOpenAiConfig } from './context/index.js'
import { useForm } from 'react-hook-form'

export const OpenAiPlugin = (props: OpenAiConfig) => {
  useLayoutEffect(() => useOpenAiConfig.setState(props), [props])
  // if (!useOpenAiConfig.getState()) useOpenAiConfig.setState(props)
  return (
    <>
      <FolderAction>
        <GenerateIcon />
      </FolderAction>
    </>
  )
}

const GenerateIcon = () => {
  const storage = useFirebaseStorage()
  const [open, setOpen] = useState(false)
  const form = useForm<ImageGenerateParams>({
    defaultValues: {
      model: 'dall-e-2',
      prompt: '',
      size: '256x256',
      n: 1,
      response_format: 'b64_json',
      quality: 'standard',
      style: 'natural',
    },
  })
  const generate = useSWRMutation('generate', () => {
    const client = new OpenAI({
      dangerouslyAllowBrowser: true,
      organization: '_',
      apiKey: '_',
      baseURL: 'http://127.0.0.1:8004/fuel-nosense/us-central1/openai/v1',
    })
    return client.images.generate(form.getValues())
  })
  const model = form.watch('model')

  console.log(generate.isMutating, generate.data?.data)

  return (
    <>
      <WorkbenchModal open={open} close={() => setOpen(false)}>
        <Header breadcrumbs={[{ children: 'OpenAI Image generation', href: '' }]}></Header>
        <form className="grid grid-cols-3 gap-2 p-2">
          <Field name="model" label="Model">
            <FieldControl>
              <Select id="model" {...form.register('model')}>
                <option>dall-e-2</option>
                <option>dall-e-3</option>
              </Select>
            </FieldControl>
          </Field>
          <Field name="size" label="Size">
            <FieldControl>
              <Select id="size" {...form.register('size')}>
                <option>256x256</option>
                <option>512x512</option>
                <option>1024x1024</option>
                <option>1792x1024</option>
                <option>1024x1792</option>
              </Select>
            </FieldControl>
          </Field>
          {model === 'dall-e-2' && (
            <Field name="n" label="Number">
              <FieldControl>
                <Input type="number" {...form.register('n', { valueAsNumber: true })} />
              </FieldControl>
            </Field>
          )}
          {model === 'dall-e-3' && (
            <Field name="quality" label="Quality">
              <FieldControl>
                <Select id="quality" {...form.register('quality')}>
                  <option>standard</option>
                  <option>hd</option>
                </Select>
              </FieldControl>
            </Field>
          )}
          {model === 'dall-e-3' && (
            <Field name="style" label="Style">
              <FieldControl>
                <Select id="style" {...form.register('style')}>
                  <option>natural</option>
                  <option>vivid</option>
                </Select>
              </FieldControl>
            </Field>
          )}
          <Field name="prompt" label="Prompt" className="col-span-3">
            <FieldControl>
              <TextArea {...form.register('prompt')} />
            </FieldControl>
          </Field>
          <div className="col-span-3 flex w-full justify-end">
            <Button disabled={generate.isMutating} onClick={() => generate.trigger()}>
              Generate
            </Button>
          </div>
        </form>
        <div className="grid-cols-2">
          {generate.data?.data.map((x, i) => (
            <div key={i}>
              <div
                className="aspect-square w-full"
                onClick={() => {
                  const src = x.b64_json
                  if (!src) return

                  const hash = src.split('').reduce((a, b) => {
                    a = (a << 5) - a + b.charCodeAt(0)
                    return a & a
                  }, 0)

                  const fullPath = `/photos/${hash}.png`
                  useUploads.getState().add(
                    {
                      fullPath: `/photos/${hash}.png`,
                      contentType: 'image/png',
                      folder: '/photos',
                      url: `data:image/png;base64,${src}`,
                      task: uploadBytesResumable(ref(storage, fullPath), base64ToArrayBuffer(src), {
                        contentType: 'image/png',
                      }),
                    },
                    () => {},
                  )
                }}
              >
                <img src={`data:image/png;base64,${x.b64_json}`} className="object-contain object-center" />
              </div>
              {x?.b64_json?.split('').reduce((a, b) => {
                a = (a << 5) - a + b.charCodeAt(0)
                return a & a
              }, 0)}
            </div>
          ))}
        </div>
      </WorkbenchModal>
      <Button size="sm" icon={<PaintBrushIcon />} onClick={() => setOpen(!open)}>
        Generate
      </Button>
    </>
  )
}

function base64ToArrayBuffer(base64: string) {
  var binaryString = atob(base64)
  var bytes = new Uint8Array(binaryString.length)
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}
