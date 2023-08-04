import { useState } from 'react'

export const useFocusState = (props?: { onBlur?: () => void; onFocus?: () => void }) => {
  const state = useState(false)
  const onBlur = (_x?: any) => (state[1](false), props?.onBlur && props?.onBlur())
  const onFocus = (_x?: any) => (state[1](true), props?.onFocus && props?.onFocus())
  return [{ onBlur, onFocus }, ...state] as const
}
