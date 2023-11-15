import React, { ElementRef } from 'react'

/* Alias to fixe type definition for `forwardRef`. */
export const forwardRefElement: <T extends keyof JSX.IntrinsicElements = 'div', P = {}>(
  render: (props: P, ref: React.Ref<ElementRef<T>>) => JSX.Element,
) => (props: P & React.RefAttributes<ElementRef<T>>) => JSX.Element = React.forwardRef as any

export const forwardRef = <T extends (props: any, ref?: React.ForwardedRef<any>) => any>(component: T) =>
  React.forwardRef(component) as any as T

export const forwardRefElem: <T extends keyof JSX.IntrinsicElements = 'div', P = {}>(
  render: (props: JSX.IntrinsicElements[T] & P, ref: React.Ref<ElementRef<T>>) => JSX.Element,
) => (props: JSX.IntrinsicElements[T] & P & React.RefAttributes<ElementRef<T>>) => JSX.Element = React.forwardRef as any
