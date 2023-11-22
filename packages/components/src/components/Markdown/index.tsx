import ReactMardown, { Options } from 'react-markdown'
import { cn } from 'mcn'

export const Markdown = (props: Options) => <ReactMardown {...props} className={cn('prose', props.className)} />
