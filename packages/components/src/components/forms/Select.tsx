import { cn } from 'mcn'

export const Select = (props: JSX.IntrinsicElements['select']) => {
  return <select {...props} className={cn('h-full w-full bg-transparent', props.className)} />
}

Select.Option = (props: JSX.IntrinsicElements['option']) => {
  return <option {...props} />
}
