import tailwind from 'fiar/tailwind.config'
import path from 'path'

export default {
  ...tailwind,
  content: tailwind.content.map((x) => path.resolve(require.resolve('fiar/tailwind.config'), `../${x}`)),
}
