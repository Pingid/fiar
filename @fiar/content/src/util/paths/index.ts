export const get = <T>(pth: string, obj?: Record<string, any> | undefined): T => {
  const path = (pth as string).split('.').map((x) => (/^\d{1,}$/.test(x) ? parseInt(x) : x))
  return path.reduce((a, b) => a && (a as any)[b], obj) as any
}

export const set = (path: string, obj: any, value: any) => {
  const keys = (path as string).split('.').map((x) => (/^\d{1,}$/.test(x) ? parseInt(x) : x))
  const last: any = keys.pop()
  let o: any = obj
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as any
    const next = keys[i + 1] || last
    if (!o.hasOwnProperty(key) || typeof o[key] !== 'object') {
      if (typeof next === 'number') o[key] = []
      else o[key] = {}
    }
    o = o[key]
  }
  if (!o) {
    if (typeof last === 'number') o = []
    else o = {}
  }
  o[last] = value
}

const setAt = (path: (string | number)[], obj: any, value: any): void => {
  let current = obj
  if (current === null) {
    current = typeof path[0] === 'number' ? [] : {}
  }

  let _path = path as any[]
  // Iterate over all elements of the path array except the last one
  for (let i = 0; i < _path.length - 1; i++) {
    let isIndex = typeof _path[i + 1] === 'number'
    if (!(_path[i] in current)) {
      current[_path[i]] = isIndex ? [] : {}
    }
    current = current[_path[i]]
  }
  current[_path[_path.length - 1]] = value
}

const setNew = ([head, ...tail]: (string | number)[], obj: any, value: any): void => {
  if (typeof head === 'undefined') return value
  const next =
    typeof head === 'number' ? (Array.isArray(obj) ? obj : []) : typeof obj === 'object' && obj !== null ? obj : {}
  next[head] = setNew(tail, next?.[head], value)
  return next
}
export const lense = { get, set, setAt, setNew }
