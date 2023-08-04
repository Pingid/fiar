import React, { ElementRef } from 'react'

/* Alias to fixe type definition for `forwardRef`. */
export const forwardRef: <T extends keyof JSX.IntrinsicElements = 'div', P = {}>(
  render: (props: P, ref: React.Ref<ElementRef<T>>) => JSX.Element,
) => (props: P & React.RefAttributes<ElementRef<T>>) => JSX.Element = React.forwardRef as any

export const forwardRefElem: <T extends keyof JSX.IntrinsicElements = 'div', P = {}>(
  render: (props: JSX.IntrinsicElements[T] & P, ref: React.Ref<ElementRef<T>>) => JSX.Element,
) => (props: P & React.RefAttributes<ElementRef<T>>) => JSX.Element = React.forwardRef as any
