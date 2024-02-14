import calender from 'dayjs/plugin/calendar.js'
import dayjs from 'dayjs'

export const abs = (str: string) => '/' + str.replace(/^\//, '')
export const parameterize = (path: string) => trailing(path).replace(/\{([^\}]+)\}/g, ':$1')
export const trailing = (path: string) => path.replace(/\/\{[^\}]+\}$/, '')

dayjs.extend(calender)

export const date = dayjs
