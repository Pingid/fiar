import { cn } from 'mcn'

import ReactTextareAutosize, { TextareaAutosizeProps as _TextareaAutosizeProps } from 'react-textarea-autosize'
import { forwardRefElement } from '../../util/forwardRef.js'

export interface TextareaAutosizeProps extends _TextareaAutosizeProps {}

export const TextArea = forwardRefElement<'textarea', TextareaAutosizeProps>((props, ref) => (
  <ReactTextareAutosize
    {...(props as any)}
    className={cn(
      'h-full w-full resize-none bg-transparent px-2 pt-1 focus:border-none focus:outline-none',
      props.className,
    )}
    ref={ref as any}
  />
))
