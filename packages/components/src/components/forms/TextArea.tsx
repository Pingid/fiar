import { cn } from 'mcn'

import ReactTextareAutosize, { TextareaAutosizeProps as _TextareaAutosizeProps } from 'react-textarea-autosize'
import { extend } from '../../util/forwardRef.js'

export interface TextareaAutosizeProps extends _TextareaAutosizeProps {}

export const TextArea = extend<'textarea', TextareaAutosizeProps>((props, ref) => (
  <ReactTextareAutosize
    {...props}
    ref={ref}
    className={cn(
      '-mb-0.5 h-full w-full resize-none bg-transparent px-2 pt-1 focus:border-none focus:outline-none',
      props.className,
    )}
  />
))
