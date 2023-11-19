import calender from 'dayjs/plugin/calendar.js'
import dayjs from 'dayjs'

export const abs = (str: string) => '/' + str.replace(/^\//, '')

dayjs.extend(calender)

export const date = dayjs
