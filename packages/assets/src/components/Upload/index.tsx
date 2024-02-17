import { TaskState, UploadTask } from '@firebase/storage'
import {
  CheckIcon,
  ExclamationCircleIcon,
  NoSymbolIcon,
  PauseIcon,
  PlayIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

import { Thumbnail } from '../Thumb/index.js'

export const Upload = (props: { task: UploadTask; file: File }) => {
  return (
    <div className="relative flex items-end gap-1 border">
      <Thumbnail className={'h-[3rem] w-min'} url={URL.createObjectURL(props.file)} contentType={props.file.type} />

      <div className="p-1">
        <div className="bg-frame w-full min-w-[5rem] rounded-md">
          <Progress task={props.task} />
        </div>
      </div>
      <div className="absolute right-[2px] top-[2px] flex">
        <StateButton task={props.task} />
        <Button onClick={() => props.task.cancel()}>
          <XMarkIcon className="h-full w-full" strokeWidth="2px" />
        </Button>
      </div>
    </div>
  )
}

const StateButton = (props: { task: UploadTask }) => {
  const [state, setState] = useState<TaskState>('running')

  useEffect(() => void props.task.on('state_changed', (x) => setState(x.state)), [props.task])

  const icon = {
    paused: <PlayIcon className="h-full w-full" strokeWidth="2px" />,
    canceled: <NoSymbolIcon className="h-full w-full" strokeWidth="2px" />,
    error: <ExclamationCircleIcon className="h-full w-full" strokeWidth="2px" />,
    running: <PauseIcon className="h-full w-full" strokeWidth="2px" />,
    success: <CheckIcon className="h-full w-full" strokeWidth="2px" />,
  }[state]

  const handler = {
    paused: () => props.task.resume(),
    running: () => props.task.pause(),
    canceled: () => null,
    error: () => null,
    success: () => null,
  }[state]

  return (
    <Button disabled={['canceled', 'error', 'success'].includes(state)} onClick={handler}>
      {icon}
    </Button>
  )
}

const Button = (props: JSX.IntrinsicElements['button']) => (
  <button
    className="hover text-active text-front/30 hover:text-active flex h-4 w-4 flex-shrink-0 items-center justify-center"
    {...props}
  />
)

const Progress = (props: { task: UploadTask }) => {
  const [progress, setProgress] = useState(0)

  useEffect(
    () => void props.task.on('state_changed', (x) => setProgress(x.bytesTransferred / x.totalBytes)),
    [props.task],
  )

  return <div className="bg-active h-1 w-2/3 rounded-md" style={{ width: `${progress * 100}%` }} />
}
