let stack: any[] = []

type Scoped<T = any> = (cb: (push: (...args: any[]) => void) => void) => T[]

export const create: Scoped = (cb) => {
  let previous = stack
  stack = []
  cb((...args) => stack.push(...args))
  let next = stack
  stack = previous
  return next
}

export const push = (...args: any[]) => stack.push(...args)
export const prepend = (...args: any[]) => (stack = [...args, ...stack])
