import React, { useEffect, useRef, useState } from 'react'

import { ContentFieldEventHandler, IContentField } from '../../schema/field'
import { useDocumentDataStore } from '../document/data'
import { DocumentVersions } from '../../schema/document'
import { useDocument } from '../document'
import { useConfig } from '../config'
import { tp } from 'typeofit'

export const ContentVersionContext = React.createContext<keyof DocumentVersions | null>(null)
export const ContentVersionProvider = ContentVersionContext.Provider
export const useContentVersion = () => React.useContext(ContentVersionContext)!

export const ContentFieldPathContext = React.createContext<(string | number)[]>([])
export const ContentFieldPathProvider = ContentFieldPathContext.Provider
export const useFieldPath = () => React.useContext(ContentFieldPathContext)!

export const ContentFieldContext = React.createContext<IContentField | null>(null)
export const ContentFieldProvider = (p: {
  children: React.ReactNode
  value: IContentField
  path?: string | number
}): JSX.Element => {
  const parent = useFieldPath()
  return (
    <ContentFieldContext.Provider value={p.value}>
      <ContentFieldPathProvider value={[...parent, ...(tp.defined(p.path) ? [p.path] : [])]}>
        {p.children}
      </ContentFieldPathProvider>
    </ContentFieldContext.Provider>
  )
}

export const useField = <I extends IContentField>(props?: {
  equal?: (a: null | undefined | I['infer'], b: null | undefined | I['infer']) => boolean
}) => {
  const field = React.useContext(ContentFieldContext)! as I
  const handler = useRef(field.handle)
  const path = React.useContext(ContentFieldPathContext)
  const store = useDocumentDataStore()!
  const subscriber = React.useRef<() => void>()
  const doc = useDocument()!
  const config = useConfig()

  const [_value, _setvalue] = useState<I['infer'] | undefined>(store.getState().value(path))
  const [error, seterror] = useState<string | null>(null)

  const equal = useRef(props?.equal || ((a: any, b: any) => a === b))
  useEffect(() => void (equal.current = props?.equal || ((a: any, b: any) => a === b)), [props?.equal])

  // Handle subscribing to changes when reading value
  const value = (): I['infer'] | undefined | null => {
    sub()
    return _value
  }
  const sub = () => {
    if (subscriber.current) return
    subscriber.current = store.getState().onValue(path, (x) => {
      if (!equal.current(x, _value)) _setvalue(x)
    })
  }
  useEffect(() => () => subscriber.current && subscriber.current(), [])

  // Handle value update
  const update = (value: I['infer'] | null) => {
    if (error) {
      Promise.resolve(handler.current({ ...config, ...doc }, { type: 'publish', value, valid: true })).then((x) => {
        if (x.valid) seterror(null)
      })
    }
    if (subscriber.current) _setvalue(value)
    return store.getState().update(path, value)
  }

  // Handle field validation by overwriting the handler
  const element = useRef<null | HTMLElement>(null)
  const ref = (_x: null | HTMLElement) => (element.current = _x)
  useEffect(() => {
    return store.getState().on(path, async (ctx, ev) => {
      const result = await handler.current(ctx, ev)

      if (result.valid === false) {
        element.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
        seterror(result.reason)
      }
      return result
    })
  }, [path])

  return {
    ...field,
    error,
    value,
    update,
    ref,
    handle: (x: ContentFieldEventHandler<I['infer'] | null | undefined>) => (handler.current = x),
  }
}
