import React, { useContext } from 'react'

const WorkbenchConfigContext = React.createContext<WorkbenchConfig | null>(null)
export const WorkbenchConfigProvider = WorkbenchConfigContext.Provider

export type WorkbenchConfig = {
  basename?: string | undefined
  routing?: 'hash' | 'browser' | 'memory' | undefined
}

export const useWorkbenchConfig = () => {
  const config = useContext(WorkbenchConfigContext)
  if (!config) throw new Error('Missing Workbench config')
  return config
}
