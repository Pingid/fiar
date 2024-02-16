import { StatusProvider } from '../status/index.js'
import { Header } from '../header/index.js'

export const Page = ({ children }: { children: React.ReactNode }) => {
  return <StatusProvider>{children}</StatusProvider>
}

Page.Header = Header
