import React, { ForwardedRef } from 'react'

export const extend = <K extends keyof JSX.IntrinsicElements, P extends Record<string, any> = {}>(
  comp: (
    props: JSX.IntrinsicElements[K] & P & { elementType?: K },
    ref: ForwardedRef<K extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[K] : any>,
  ) => JSX.Element,
): Extend<K, P> => React.forwardRef(comp) as any

export type Extend<K extends keyof JSX.IntrinsicElements, P extends Record<string, any>> = {
  <I extends JSX.IntrinsicElements[K] & P>(props: I): JSX.Element
  <E extends keyof JSX.IntrinsicElements, I extends JSX.IntrinsicElements[E] & P & { elementType: E }>(
    props: I,
  ): JSX.Element
}

export const forward = <K extends keyof JSX.IntrinsicElements, P extends Record<string, any> = {}>(
  comp: (
    props: JSX.IntrinsicElements[K] & P,
    ref: ForwardedRef<K extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[K] : any>,
  ) => JSX.Element,
): Forward<K, P> => React.forwardRef(comp) as any

export type Forward<K extends keyof JSX.IntrinsicElements, P extends Record<string, any>> = <
  I extends JSX.IntrinsicElements[K] & P,
>(
  props: I,
) => JSX.Element
