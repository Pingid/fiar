import { shallow } from 'zustand/shallow'

import { useFiarAppState } from '../../context'

export const useWorkbenchPages = () =>
  useFiarAppState(
    (x) => Object.keys(x.components).filter((x): x is `workbench:page:${string}` => /workbench:page:\w.*?$/.test(x)),
    shallow,
  )
export const useWorkbenchPage = (name: `workbench:page:${string}`) => useFiarAppState((x) => x.components[name])

export const useWorkbenchProviders = () =>
  useFiarAppState(
    (x) =>
      Object.keys(x.components).filter((x): x is `workbench:provider:${string}` => /workbench:provider:\w.*?$/.test(x)),
    shallow,
  )
