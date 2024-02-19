import { FieldError } from 'react-hook-form'
export * from 'react-hook-form'

export * from '../context/document.js'

export const fieldError = (err?: FieldError) => {
  if (!err) return undefined
  if (err.message) return err.message
  if (err.type === 'required') return `Required value`
  return 'Invalid'
}
